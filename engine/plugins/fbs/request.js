/**
 * @file
 * Handle sip2 response from FBS server.
 */

'use strict';

const handlebars = require('handlebars');
const fs = require('fs');
const debug = require('debug')('bibbox:FBS:request');
const path = require('path');
const Response = require('./response.js');

/**
 * Request object.
 *
 * @param bus
 *   Event bus.
 * @param config
 *   FBS connection config.
 */
const Request = function Request(bus, config) {
    const self = this;
    self.bus = bus;

    // Load the template used for the XMl request.
    const source = fs.readFileSync(path.join(__dirname, 'templates/sip2_message.xml'), 'utf8');
    self.template = handlebars.compile(source);

    self.username = config.username;
    self.password = config.password;
    self.endpoint = config.endpoint;
    self.agency = config.agency;
    self.location = config.location ?? 'Unknown';
};

/**
 * Zero pads (one zero) number.
 *
 * Helper function to create sip2 timestamp.
 *
 * @param number
 *   Number to pad.
 *
 * @returns {string}
 *   Padded number.
 */
Request.prototype.zeroPad = function zeroPad(number) {
    return ('0' + (number)).slice(-2);
};

/**
 * Encode timestamp into sip2 date format.
 *
 * @param {int|null} timestamp
 *   Javascript timestamp.
 *
 * @returns {string}
 *   The time as sip2 time string.
 */
Request.prototype.encodeTime = function encodeTime(timestamp = null) {
    if (!timestamp) {
        timestamp = new Date().getTime();
    }
    const d = new Date(timestamp);

    return '' + d.getFullYear() + this.zeroPad(d.getMonth() + 1) + this.zeroPad(d.getDate()) + '    ' + this.zeroPad(d.getHours()) + this.zeroPad(d.getMinutes()) + this.zeroPad(d.getSeconds());
};

/**
 * Use template to build an XML message.
 *
 * @param message
 *   Message to wrap in XML.
 *
 * @returns {string}
 *   XML message.
 */
Request.prototype.buildXML = function buildXML(message) {
    const self = this;
    return self.template({
        username: self.username,
        password: self.password,
        message: message
    });
};

/**
 * Send a request to FBS.
 *
 * @param message
 *   The message to send.
 * @param firstVar
 *   The first variable expected in the response.
 * @param callback
 *   Function to execute when data is fetched and parsed. Takes a Message object
 *   as a parameter.
 */
Request.prototype.send = function send(message, firstVar, callback) {
    const self = this;

    // Build XML message.
    const xml = self.buildXML(message);

    // Log the message before sending it.
    self.bus.emit('logger.info', {type: 'FBS', message: message, xml: xml});

    let status;

    fetch(self.endpoint, {
        method: 'POST',
        headers: {
            'User-Agent': 'bibbox',
            'Content-Type': 'application/xml'
        },
        body: xml
    })
        .then(response => {
            status = response.status;

            return response.text();
        })
        .then(body => {
            const res = new Response(body, firstVar);
            let sip2message;

            if (res.hasError()) {
                sip2message = res.getError();
                callback(new Error('FBS is offline'), null);
            } else {
                // Log debug message.
                debug(status + ':' + message.substr(0, 2));

                const sip2 = body.match(/<response>(.*)<\/response>/);
                sip2message = sip2[1];

                // Process the data.
                callback(null, res);
            }

            // Log message from FBS.
            self.bus.emit('logger.info', {type: 'FBS', message: sip2message, xml: body});
        })
        .catch((error) => {
            self.bus.emit('logger.info', {type: 'FBS', message: error.message});
            callback(new Error('FBS is offline'), null);
        });
};

/**
 * Send the status message to FBS.
 *
 * @param callback
 *   Function to call when completed request to FBS.
 */
Request.prototype.libraryStatus = function libraryStatus(callback) {
    const self = this;
    self.send('990xxx2.00', 'AO', callback);
};

/**
 * Get patron status.
 *
 * @param patronId
 *   Patron card number or CPR number.
 * @param patronPassword
 *   Pin code/password for the patron.
 * @param callback
 *   Function to call when completed request to FBS.
 */
Request.prototype.patronStatus = function patronStatus(patronId, patronPassword, callback) {
    const self = this;
    const transactionDate = self.encodeTime();
    const message = '23009' + transactionDate + '|AO' + self.agency + '|AA' + patronId + '|AC|AD' + patronPassword + '|';

    self.send(message, 'AO', callback);
};

/**
 * Get all information about a patron.
 *
 * @param patronId
 *   Patron card number or CPR number.
 * @param patronPassword
 *   Pin code/password for the patron.
 * @param callback
 *   Function to call when completed request to FBS.
 */
Request.prototype.patronInformation = function patronInformation(patronId, patronPassword, callback) {
    const self = this;
    const transactionDate = self.encodeTime();
    const message = '63009' + transactionDate + new Array(10).join('Y') + '|AO' + self.agency + '|AA' + patronId + '|AC|AD' + patronPassword + '|';

    self.send(message, 'AO', callback);
};

/**
 * Check out item.
 *
 * @param patronId
 *   Patron card number or CPR number.
 * @param patronPassword
 *   Pin code/password for the patron.
 * @param itemIdentifier
 *   The item to check out.
 * @param noBlockDueDate
 *   Timestamp for the time the book should be returned (when noBlock is true).
 * @param {bool} noBlock
 *   If true, FBS cannot reject the check-out.
 * @param {number} transactionDate
 *   Timestamp for when the user preformed the action.
 * @param {function} callback
 *   Function to call when completed request to FBS.
 */
Request.prototype.checkout = function checkout(patronId, patronPassword, itemIdentifier, noBlockDueDate, noBlock, transactionDate, callback) {
    const self = this;
    const transactionDateEncoded = self.encodeTime(transactionDate);
    const noBlockDueDateEncoded = self.encodeTime(noBlockDueDate);
    const message = '11N' + (noBlock ? 'Y' : 'N') + transactionDateEncoded + noBlockDueDateEncoded + '|AO' + self.agency + '|AA' + patronId + '|AB' + itemIdentifier + '|AC|CH|AD' + patronPassword + '|';

    self.send(message, 'AO', callback);
};

/**
 * Check in item.
 *
 * @param itemIdentifier
 *   The item to check in.
 * @param checkedInDate
 *   Timestamp for the time that the item was returned.
 * @param noBlock
 *   If true, FBS cannot reject the check-in.
 * @param callback
 *   Function to call when completed request to FBS.
 */
Request.prototype.checkIn = function checkIn(itemIdentifier, checkedInDate, noBlock, callback) {
    const self = this;
    const checkedInDateEncoded = self.encodeTime(checkedInDate);
    const message = '09' + (noBlock ? 'Y' : 'N') + checkedInDateEncoded + checkedInDateEncoded + '|AP' + self.location + '|AO' + self.agency + '|AB' + itemIdentifier + '|AC|CH|';

    self.send(message, 'AO', callback);
};

/**
 * Renew item.
 *
 * @param patronId
 *   Patron card number or CPR number.
 * @param patronPassword
 *   Pin code/password for the patron.
 * @param itemIdentifier
 *   The item to renew.
 * @param callback
 *   Function to call when completed request to FBS.
 */
Request.prototype.renew = function renew(patronId, patronPassword, itemIdentifier, callback) {
    const self = this;
    const transactionDate = self.encodeTime();
    const message = '29NN' + transactionDate + transactionDate + '|AO' + self.agency + '|AA' + patronId + '|AD' + patronPassword + '|AB' + itemIdentifier + '|';

    self.send(message, 'AO', callback);
};

/**
 * Renew all items.
 *
 * @param patronId
 *   Patron card number or CPR number.
 * @param patronPassword
 *   Pin code/password for the patron.
 * @param callback
 *   Function to call when completed request to FBS.
 */
Request.prototype.renewAll = function renewAll(patronId, patronPassword, callback) {
    const self = this;
    const transactionDate = self.encodeTime();
    const message = '65' + transactionDate + '|AO' + self.agency + '|AA' + patronId + '|AD' + patronPassword + '|';

    self.send(message, 'AO', callback);
};

/**
 * Block patron.
 *
 * Note: that there is no response from SIP2 on this call.
 *
 * @param patronId
 *   Patron card number or CPR number.
 * @param reason
 *   Message with the reason for the user being blocked.
 * @param callback
 *   Function to call when completed request to FBS.
 */
Request.prototype.blockPatron = function blockPatron(patronId, reason, callback) {
    const self = this;
    const transactionDate = self.encodeTime();
    const message = '01N' + transactionDate + '|AO' + self.agency + '|AL' + reason + '|AA' + patronId + '|';

    self.send(message, 'AO', callback);
};

module.exports = Request;
