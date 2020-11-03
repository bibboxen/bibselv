/**
 * @file
 * Queue to handle SIP2 message when offline.
 */

'use strict';

const BullQueue = require('bull');
const Q = require('q');

/**
 * Class Queue.
 */
class Queue {
    /**
     * Default constructor.
     *
     * @param bus
     *   The system message bus.
     * @param host
     *   Redis host.
     * @param port
     *   Redis port.
     * @param db
     *  Redis database to use.
     */
    constructor(bus, host, port, db) {
        const url = 'redis://' + host + ':' + port + '/' + db;
        const self = this;

        this.bus = bus;
        this.checkinQueue = new BullQueue('checkinQueue', url);
        this.checkoutQueue = new BullQueue('checkoutQueue', url);

        // Set the front-end out-of-order on queue errors (redis errors included).
        this.checkinQueue.on('error', function(err) {
            bus.emit('logger.err', { type: 'offline', message: err });
            bus.emit('queue.error');
        });
        this.checkoutQueue.on('error', function(err) {
            bus.emit('logger.err', { type: 'offline', message: err });
            bus.emit('queue.error');
        });

        // Add job processing functions to the queues.
        this.checkinQueue.process(this.checkin);
        this.checkoutQueue.process(this.checkout);

        // Listen to fail jobs in the check-in queue. As jobs in processing is not
        // paused when the queue is... we need to handle errors in processing jobs
        // due to FBS offline.
        this.checkinQueue.on('failed', function(job, err) {
            if (err.message === 'FBS is offline') {
                job.remove().then(function() {
                    // Job remove to re-add it as a new job.
                    self.add('checkin', job.data);
                },
                function(err) {
                    // If we can't remove the job... not much we can do.
                    self.bus.emit('logger.err', { type: 'offline', message: err.message });
                });
            }
        });

        // Listen to fail jobs in the check-out queue. As jobs in processing is not
        // paused when the queue is... we need to handle errors in processing jobs
        // due to FBS offline.
        this.checkoutQueue.on('failed', function(job, err) {
            if (err.message === 'FBS is offline') {
                job.remove().then(function() {
                    // Job remove to re-add it as a new job.
                    self.add('checkout', job.data);
                },
                function(err) {
                    // If we can't remove the job... not much we can do.
                    self.bus.emit('logger.err', { type: 'offline', message: err.message });
                });
            }
        });

        // Start the queues paused.
        this.pause('checkin');
        this.pause('checkout');
    }

    /**
     * Find queue based on queue type.
     *
     * @param type
     *  The type of queue (checkin or checkout).
     *
     * @returns {*}
     *   The queue if found. If not null.
     *
     * @private
     */
    _findQueue(type) {
        let queue = null;

        switch (type) {
            case 'checkin':
                queue = this.checkinQueue;
                break;

            case 'checkout':
                queue = this.checkoutQueue;
                break;
        }

        return queue;
    };

    /**
     * Add job to a queue.
     *
     * @param type
     *   The type of queue (checkin or checkout).
     * @param data
     *   The data to process.
     *
     * @returns {*}
     *   Promise that resolves to jobId if added else error.
     */
    add(type, data) {
        const deferred = Q.defer();
        const queue = this._findQueue(type);

        const opts = {
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 10000
            }
        };

        queue.add(data, opts).then(function(job) {
            deferred.resolve(job.jobId);
        },
        function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    /**
     * Pause a queue.
     *
     * @param type
     *  The type of queue (checkin or checkout).
     */
    pause(type) {
        const queue = this._findQueue(type);
        const self = this;

        queue.pause().then(function() {
            self.bus.emit('logger.info', {
                type: 'offline',
                message: 'Queue "' + queue.name + '" is paused.'
            });
        });
    };

    /**
     * Resume a queue.
     *
     * @param type
     *  The type of queue (checkin or checkout).
     */
    resume(type) {
        const queue = this._findQueue(type);
        const self = this;

        queue.resume().then(function() {
            self.bus.emit('logger.info', {
                type: 'offline',
                message: 'Queue "' + queue.name + '" has resumed.'
            });
        });
    };

    /**
     * Processing function for check-in jobs.
     *
     * @param job
     *   The job.
     * @param done
     *   Callback when done processing.
     */
    checkin(job, done) {
        const data = job.data;
        const self = this;

        // Set event callbacks that FBS should use.
        data.busEvent = 'queue.fbs.checkout.success' + data.itemIdentifier;
        data.errorEvent = 'queue.fbs.checkout.error' + data.itemIdentifier;

        this.bus.once(data.busEvent, function(res) {
            if (res.ok === '0') {
                self.bus.emit('logger.err', {
                    type: 'offline',
                    message: require('util').inspect(res, true, 10)
                });
                done(new Error(res.screenMessage));
            }

            // Success the item have been checked-in.
            done(null, res);
        });

        this.bus.once(data.errorEvent, function(err) {
            // Log the failure.
            self.bus.emit('logger.err', {
                type: 'offline',
                message: err.message
            });
            done(err);
        });

        // Request from the offline queue need to have the noBlock set to true to
        // ensure that the check-in is forced in the library system.
        data.noBlock = true;

        // Set updated timestamp to get past event timeout check in FBS plugin.
        data.timestamp = new Date().getTime();

        // Send request to FBS.
        self.bus.emit('fbs.checkin', data);
    };

    /**
     * Processing function for checkout jobs.
     *
     * @param job
     *   The job.
     * @param done
     *   Callback when done processing.
     */
    checkout(job, done) {
        const data = job.data;
        const self = this;

        // Set event callbacks that FBS should use.
        data.busEvent = 'queue.fbs.checkout.success' + data.itemIdentifier;
        data.errorEvent = 'queue.fbs.checkout.error' + data.itemIdentifier;

        this.bus.once(data.busEvent, function(res) {
            if (res.ok === '0') {
                self.bus.emit('logger.err', {
                    type: 'offline',
                    message: require('util').inspect(res, true, 10)
                });
                done(new Error(res.screenMessage));
            }

            // Success the item have been checked-out.
            done(null, res);
        });

        this.bus.once(data.errorEvent, function(err) {
            // Log the failure.
            self.bus.emit('logger.err', { type: 'offline', message: err.message });
            done(err);
        });

        // Request from the offline queue need to have the noBlock set to true to
        // ensure that the check-out is forced in the library system.
        data.noBlock = true;

        // Set updated timestamp to get past event timeout check in FBS plugin.
        data.timestamp = new Date().getTime();

        // Send request to FBS.
        self.bus.emit('fbs.checkout', data);
    };
}

/**
 * Register the plugin with architect.
 *
 * @param {array} options
 *   Options defined in app.js.
 * @param {array} imports
 *   The other plugins available.
 * @param {function} register
 *   Callback function used to register this plugin.
 */
module.exports = function(options, imports, register) {
    const bus = imports.bus;
    const queue = new Queue(bus, options.host, options.port, options.db);

    bus.on('queue.add.checkout', function(obj) {
        // Ensure that it's an copy of the object.
        const data = JSON.parse(JSON.stringify(obj));
        data.queued = true;

        queue.add('checkout', data);
    });

    bus.on('queue.add.checkin', function(obj) {
        // Ensure that it's an copy of the object.
        const data = JSON.parse(JSON.stringify(obj));
        data.queued = true;

        queue.add('checkin', data);
    });

    /**
     * Listen for online events and change state.
     */
    bus.on('fbs.online', function online() {
        queue.resume('checkin');
        queue.resume('checkout');
    });

    /**
     * Listen for offline events and change state.
     */
    bus.on('fbs.offline', function online() {
        queue.pause('checkin');
        queue.pause('checkout');
    });

    register(null, {
        queue: queue
    });
};
