/**
 * @file
 * Handles communication with FBS through SIP2.
 */

'use strict';

const Q = require('q');
const debug = require('debug')('bibbox:FBS:main');
const Request = require('./request.js');
const Brakes = require('brakes');

/**
 * Default constructor.
 *
 * @param bus
 *   The event bus.
 * @param config
 *   The FBS configuration.
 *
 * @constructor
 */
var FBS = function FBS(bus, config) {
    this.bus = bus;
    this.config = config;
};

/**
 * Send status message to FBS.
 */
FBS.prototype.libraryStatus = function libraryStatus() {
    const deferred = Q.defer();

    const req = new Request(this.bus, this.config);
    req.libraryStatus((err, response) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(response);
        }
    });

    return deferred.promise;
};

/**
 * Login check.
 *
 * @param username
 *   Username for the patron (card or CPR number).
 * @param password
 *   The patrons password.
 *
 * @return {*|promise}
 *   TRUE if valid else FALSE.
 */
FBS.prototype.login = function login(username, password) {
    const deferred = Q.defer();
    const bus = this.bus;

    const req = new Request(this.bus, this.config);
    req.patronStatus(username, password, (err, res) => {
        if (err) {
            deferred.reject(err);
        } else {
            // Check that the user is valid.
            const valid = res.validPatron === 'Y' && res.validPatronPassword === 'Y';

            // If user is valid check for blocking codes.
            if (valid) {
                if (res.patronStatus.chargePrivDenied && res.patronStatus.renewalPrivDenied &&
                    res.patronStatus.recallPrivDenied && res.patronStatus.holdPrivDenied) {
                    deferred.reject(new Error('login.invalid_login_blocked'));
                } else {
                    deferred.resolve();
                }
            } else {
                deferred.reject(new Error('login.invalid_login_error'));
            }
        }
        bus.emit('fbs.action.result', 'Login', !!err);
    });

    return deferred.promise;
};

/**
 * Get all available information about a patron.
 *
 * @param username
 *   Username for the patron (card or CPR number).
 * @param password
 *   The patrons password.
 *
 * @return {*|promise}
 *   JSON object with information or FALSE on failure.
 */
FBS.prototype.patronInformation = function patronInformation(username, password) {
    const deferred = Q.defer();
    const bus = this.bus;

    const req = new Request(this.bus, this.config);
    req.patronInformation(username, password, (err, res) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(res);
        }
        bus.emit('fbs.action.result', 'Patron Information', !!err);
    });

    return deferred.promise;
};

/**
 * Checkout (loan) item.
 *
 * @param username
 *   Username for the patron (card or CPR number).
 * @param password
 *   The patrons password.
 * @param itemIdentifier
 *   The item to checkout.
 * @param noBlockDueDate
 *   Timestamp for the time the book should be returned (when noBlock is true).
 * @param {bool} noBlock
 *   If true the request can not be blocked by the library system.
 * @param {number} transactionDate
 *   Timestamp for when the user preformed the action.
 *
 * @return {*|promise}
 *   JSON object with information or error message on failure.
 */
FBS.prototype.checkout = function checkout(username, password, itemIdentifier, noBlockDueDate, noBlock, transactionDate) {
    const deferred = Q.defer();
    const bus = this.bus;

    const req = new Request(this.bus, this.config);
    req.checkout(username, password, itemIdentifier, noBlockDueDate, noBlock, transactionDate, (err, res) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(res);
        }
        bus.emit('fbs.action.result', 'Checkout', !!err);
    });

    return deferred.promise;
};

/**
 * Check-in (return) item.
 *
 * @param itemIdentifier
 *   The item to checkout.
 * @param checkedInDate
 *   Timestamp for the time that the item was returned.
 * @param {bool} noBlock
 *   If true the request can not be blocked by the library system.
 *
 * @return {*|promise}
 *   JSON object with information or error message on failure.
 */
FBS.prototype.checkIn = function checkIn(itemIdentifier, checkedInDate, noBlock) {
    const deferred = Q.defer();
    const bus = this.bus;

    const req = new Request(this.bus, this.config);
    req.checkIn(itemIdentifier, checkedInDate, noBlock, (err, res) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(res);
        }
        bus.emit('fbs.action.result', 'Checkin', !!err);
    });

    return deferred.promise;
};

/**
 * Renew item.
 *
 * @param username
 *   Username for the patron (card or CPR number).
 * @param password
 *   The patrons password.
 * @param itemIdentifier
 *   The item to renew.
 *
 * @return {*|promise}
 *   JSON object with information or error message on failure.
 */
FBS.prototype.renew = function renew(username, password, itemIdentifier) {
    const deferred = Q.defer();
    const bus = this.bus;

    const req = new Request(this.bus, this.config);
    req.renew(username, password, itemIdentifier, (err, res) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(res);
        }
        bus.emit('fbs.action.result', 'Renew', !!err);
    });

    return deferred.promise;
};

/**
 * Renew all items.
 *
 * @param username
 *   Username for the patron (card or CPR number).
 * @param password
 *   The patrons password.
 *
 * @return {*|promise}
 *   JSON object with information or error message on failure.
 */
FBS.prototype.renewAll = function renewAll(username, password) {
    const deferred = Q.defer();
    const bus = this.bus;

    const req = new Request(this.bus, this.config);
    req.renewAll(username, password, (err, res) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(res);
        }
        bus.emit('fbs.action.result', 'Renew All', !!err);
    });

    return deferred.promise;
};

/**
 * Block patron.
 *
 * @param username
 *   Username for the patron (card or CPR number).
 * @param reason
 *   Reason for blocking user.
 *
 * @return {*|promise}
 *   JSON object with information or error message on failure.
 */
FBS.prototype.block = function block(username, reason) {
    const deferred = Q.defer();
    const bus = this.bus;

    const req = new Request(this.bus, this.config);
    req.blockPatron(username, reason, (err, res) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(res);
        }
        bus.emit('fbs.action.result', 'Block', !!err);
    });

    return deferred.promise;
};

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

    // Extend configuration with the end-point (it's done this way to keep config.json more simple).
    options.config.endpoint = options.config.endpoint ?? options.fbsEndPoint;

    // To make this testable and not hang.
    const enableOnlineChecks = options.enableOnlineChecks ?? true;

    // Defines the configuration for the online checker below.
    const onlineState = {
        online: true,
        threshold: options?.config?.threshold ?? 0.5,
        requestTimeout: options?.config?.requestTimeout ?? 2000,
        circuitDuration: options?.config?.circuitDuration ?? 30000,
        waitThreshold: options?.config?.waitThreshold ?? 10,
        intervalDuration: options?.config?.intervalDuration ?? 5000
    };

    // Check if FBS is offline.
    if (enableOnlineChecks) {
        const onlineCheckFBS = new FBS(bus, options.config);

        const checkFBSOnline = function() {
            const deferred = Q.defer();

            // Check for library status.
            onlineCheckFBS.libraryStatus()
                .then(result => {
                    if (!result) {
                        deferred.reject(new Error('Result is not set'));
                    }

                    if (result.onlineStatus === 'Y') {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(new Error('FBS is offline'));
                    }
                })
                .catch(error => {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        const brake = new Brakes(checkFBSOnline, {
            timeout: onlineState.requestTimeout,
            threshold: onlineState.threshold,
            circuitDuration: onlineState.circuitDuration,
            waitThreshold: onlineState.waitThreshold
        });

        // Error state.
        brake.on('circuitOpen', function() {
            onlineState.online = false;
            bus.emit('fbs.offline', {
                timestamp: new Date().getTime(),
                online: onlineState
            });
        });

        // Setup online check interval.
        setInterval(() => {
            if (!brake.isOpen()) {
                brake.exec('onlineCheck').then(
                    () => {
                        onlineState.online = true;
                        bus.emit('fbs.online', {
                            timestamp: new Date().getTime(),
                            online: onlineState
                        });
                    },
                    () => {}
                );
            }
        }, onlineState.intervalDuration);
    }

    /**
     * Listen to connection state requests.
     */
    bus.on('fbs.connection_state', () => {
        const eventName = onlineState.online ? 'fbs.online' : 'fbs.offline';
        bus.emit(eventName, {
            timestamp: new Date().getTime(),
            online: onlineState
        });
    });

    /**
     * Listen to login requests.
     */
    bus.on('fbs.login', data => {
        const fbs = new FBS(bus, data.config);
        fbs.login(data.username, data.password).then(
            () => {
                bus.emit(data.busEvent, {
                    timestamp: new Date().getTime()
                });
            },
            err => {
                bus.emit(data.errorEvent, err);
            }
        );
    });

    /**
     * Listen to library status requests.
     */
    bus.on('fbs.library.status', data => {
        const fbs = new FBS(bus, data.config);
        fbs.libraryStatus().then(res => {
            bus.emit(data.busEvent, {
                timestamp: new Date().getTime(),
                results: res
            });
        },
        err => {
            bus.emit(data.errorEvent, err);
        });
    });

    /**
     * Listen to patron status requests.
     */
    bus.on('fbs.patron', data => {
        const fbs = new FBS(bus, data.config);
        fbs.patronInformation(data.username, data.password).then(status => {
            bus.emit(data.busEvent, {
                timestamp: new Date().getTime(),
                patron: status
            });
        },
        err => {
            bus.emit(data.errorEvent, err);
        });
    });

    /**
     * Listen to checkout requests.
     */
    bus.on('fbs.checkout', data => {
        // Check if this is a processing of offline queue.
        data.queued = data.queued || false;

        // Set noBlock due date if not set. This due data is ignored if the noBlock
        // field is false. So we set it to expire in 31 days into the future, so if
        // this gets into the offline queue and gets noBlocked the date is set.
        if (!Object.prototype.hasOwnProperty.call(data, 'noBlockDueDate')) {
            data.noBlockDueDate = new Date().getTime() + 2678400000;
        }

        // Ensure that the noBlock parameter to FBS is set to 'N' as default.
        // NoBlock have been added in a later release an may not be in all
        // request.
        const noBlock = Object.prototype.hasOwnProperty.call(data, 'noBlock') ? data.noBlock : false;

        // Set transaction date if not set already (offline queued item will have
        // the date already).
        data.transactionDate = data.transactionDate || new Date().getTime();

        // Create FBS object and send checkout request.
        const fbs = new FBS(bus, data.config);
        fbs.checkout(
            data.username,
            data.password,
            data.itemIdentifier,
            data.noBlockDueDate,
            noBlock,
            data.transactionDate
        ).then(res => {
            bus.emit(data.busEvent, {
                timestamp: new Date().getTime(),
                result: res
            });
        },
        err => {
            if (err.message === 'FBS is offline' && data.queued === false) {
                // Add to job queue.
                bus.emit('queue.add.checkout', data);
            } else {
                bus.emit(data.errorEvent, err);
            }
        });
    });

    /**
     * Listen to checkIn requests.
     */
    bus.on('fbs.checkin', data => {
        // Check if this is a processing of offline queue.
        data.queued = data.queued || false;

        // Set checked-in date if not set.
        data.checkedInDate = data.checkedInDate || new Date().getTime();

        // Create FBS object and send check-in request.
        const fbs = new FBS(bus, data.config);

        // Ensure that the noBlock parameter to FBS is set to 'N' as default.
        // NoBlock have been added in a later release an may not the be in all
        // request.
        const noBlock = Object.prototype.hasOwnProperty.call(data, 'noBlock') ? data.noBlock : false;

        // Perform the checking request.
        fbs.checkIn(
            data.itemIdentifier,
            data.checkedInDate,
            noBlock
        ).then(res => {
            bus.emit(data.busEvent, {
                timestamp: new Date().getTime(),
                result: res
            });
        },
        err => {
            if (err.message === 'FBS is offline' && data.queued === false) {
                // Add to job queue.
                bus.emit('queue.add.checkin', data);
            } else {
                bus.emit(data.errorEvent, err);
            }
        });
    });

    /**
     * Listen to renew requests.
     */
    bus.on('fbs.renew', data => {
        const fbs = new FBS(bus, data.config);
        fbs.renew(data.username, data.password, data.itemIdentifier)
            .then(res => {
                bus.emit(data.busEvent, {
                    timestamp: new Date().getTime(),
                    result: res
                });
            },
            err => {
                bus.emit(data.errorEvent, err);
            });
    });

    /**
     * Listen to renew all requests.
     */
    bus.on('fbs.renew.all', data => {
        const fbs = new FBS(bus, data.config);
        fbs.renewAll(data.username, data.password).then(res => {
            bus.emit(data.busEvent, {
                timestamp: new Date().getTime(),
                result: res
            });
        },
        err => {
            bus.emit(data.errorEvent, err);
        });
    });

    /**
     * Listen to block patron requests.
     */
    bus.on('fbs.block', data => {
        const fbs = new FBS(bus, data.config);
        fbs.block(data.username, data.reason).then(res => {
            bus.emit(data.busEvent, {
                timestamp: new Date().getTime(),
                result: res
            });
        },
        err => {
            bus.emit(data.errorEvent, err);
        });
    });

    register(null, {
        fbs: FBS
    });

    debug('Registered plugin');
};
