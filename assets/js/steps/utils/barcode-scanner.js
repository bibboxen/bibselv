/**
 * @file
 * Contains the barcode scanning listener.
 * Based on the method from https://stackoverflow.com/a/55251571
 */
import {
    BARCODE_CODE_2OF5,
    BARCODE_CODE_COMMAND,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_TYPE_2OF5,
    BARCODE_TYPE_COMMAND,
    BARCODE_TYPE_DEFAULT
} from '../../constants';

// Barcode pattern.
const pattern = /(!B[A-Z]\d{2})(?<code>\w+)!C/g;

/* Examples
  Default:    !BA10\d{10}!C
  2OF5:       !BD10\d{10}!C
  Command:    !BA03\d{3}!C
*/

/**
 * BarcodeScanner.
 *
 * Class to receive results from a barcode scanner.
 */
export class BarcodeScanner {
    /**
     * BarcodeScanner constructor.
     *
     * @param timeoutLimit {int|null}
     * @constructor
     */
    constructor(timeoutLimit = BARCODE_SCANNING_TIMEOUT) {
        if (timeoutLimit !== null && !Number.isInteger(timeoutLimit)) {
            throw new Error('timeoutLimit must be an integer');
        }

        this.code = '';
        this.timeoutLimit = timeoutLimit;
        this.resultCallback = null;
        this.timeout = null;

        this.handleKeypress = this.handleKeypress.bind(this);
        this.result = this.result.bind(this);
    }

    /**
     * Handles result of scanning.
     */
    result() {
        if (this.resultCallback === null) {
            return;
        }

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }

        if (this.code.length > 0) {
            const input = this.code;
            const matches = [...input.matchAll(pattern)];

            // Make callback for each match.
            matches.forEach(match => {
                let barcodeType = BARCODE_TYPE_DEFAULT;
                let codedBarcodeScanner = false;
                let callbackCode = this.code;

                if (match !== null && match.groups.code) {
                    codedBarcodeScanner = true;
                    callbackCode = match.groups.code;

                    switch (this.code.substr(1, 4)) {
                        case BARCODE_CODE_COMMAND:
                            barcodeType = BARCODE_TYPE_COMMAND;
                            break;
                        case BARCODE_CODE_2OF5:
                            barcodeType = BARCODE_TYPE_2OF5;
                            break;
                    }
                } else {
                    // For scanners that are not coded.
                    if (this.code.length === 3) {
                        barcodeType = BARCODE_TYPE_COMMAND;
                    }
                }

                const callbackObject = {
                    type: barcodeType,
                    codedBarcodeScanner,
                    code: match ? match[0] : input,
                    outputCode: callbackCode
                };

                this.resultCallback(callbackObject);
            });

            this.code = '';
        } else {
            this.code = '';
        }
    }

    /**
     * Registers key presses.
     *
     * @param event
     */
    handleKeypress(event) {
        this.code += event.key;

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.result, this.timeoutLimit);
    }

    /**
     * Start listening for key presses.
     *
     * @param resultCallback
     *   The callback function to invoke when a result has been registered.
     */
    start(resultCallback) {
        this.code = '';
        this.resultCallback = resultCallback;
        document.addEventListener('keypress', this.handleKeypress);
    }

    /**
     * Stop listening for key presses.
     */
    stop() {
        document.removeEventListener('keypress', this.handleKeypress);
        this.resultCallback = null;

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}

export default BarcodeScanner;
