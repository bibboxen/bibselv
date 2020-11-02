/**
 * @file
 * Queue to handle SIP2 message when offline.
 */

'use strict';

const bullQueue = require('bull');

class Queue {

    constructor(bus, host, port, db) {
        const url = 'redis://' +  host + ':' + port + '/' + db;

        this.bus = bus;
        this.checkinQueue = new bullQueue('checkinQueue', url);
        this.checkoutQueue = new bullQueue('checkoutQueue', url);
    }

    /**
     * Pause a queue.
     *
     * @param type
     *  The type of queue (checkin or checkout).
     */
    pause(type) {
        const queue = this._findQueue(type);
        const self = this;

        queue.pause().then(function () {
            self.bus.emit('logger.info', { 'type': 'offline', 'message': 'Queue "' + queue.name + '" is paused.' });
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

        queue.resume().then(function () {
            self.bus.emit('logger.info', { 'type': 'offline', 'message': 'Queue "' + queue.name + '" has resumed.' });
        });
    };

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
     * Get the list of failed jobs.
     *
     * @param {string} type
     *   The queue type to get jobs from (checkin or checkout).
     *
     * @returns {null|*|jQuery.promise|Function|promise|d}
     *   Promise that will resolve with job count and the failed jobs.
     */
    getFailedJobs(type) {
        const deferred = Q.defer();
        const queue = this._findQueue(type);

        queue.getFailed().then(function (failedJobs) {
            let jobs = [];
            for (let i in failedJobs) {
                let job = failedJobs[i];

                // Clean internal book keeping information from the jobs data.
                let data = job.data;
                delete data.busEvent;
                delete data.errorEvent;
                delete data.queued;

                jobs.push({
                    type: job.queue.name,
                    jobId: job.jobId,
                    timestamp: job.timestamp,
                    data: data,
                    reason: job.failedReason
                });
            }
            queue.getFailedCount().then(function (count) {
                deferred.resolve({
                    count: count,
                    jobs: jobs
                });
            }, function (err) {
                deferred.reject(err);
            });
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    /**
     * Get counts (number of jobs) in the different stats.
     *
     * @param {string} type
     *   The queue type to get jobs from (checkin or checkout).
     *
     * @returns {null|*|jQuery.promise|Function|promise|d}
     *   Promise that will resolve with job counts.
     */
    getQueueCounts(type) {
        const deferred = Q.defer();
        const queue = this._findQueue(type);

        Q.all([
            queue.getCompletedCount(),
            queue.getPausedCount(),
            queue.getFailedCount(),
            queue.getDelayedCount(),
            queue.getActiveCount(),
            queue.getWaitingCount()
        ]).then(function (data) {
            deferred.resolve({
                completed: data[0],
                paused: data[1],
                failed: data[2],
                delayed: data[3],
                active: data[4],
                waiting: data[5]
            });
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
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
module.exports = function (options, imports, register) {
    const bus = imports.bus;
    const queue = new Queue(bus, options.host, options.port, options.db);

    bus.on('offline.add.checkout', function (obj) {

    });

    bus.on('offline.add.checkin', function (obj) {

    });

    bus.on('offline.failed.jobs', function (data) {

    });

    bus.on('offline.counts', function (data) {

    });

    register(null, {
        queue: queue
    });
}
