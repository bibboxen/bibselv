/**
 * @file
 * Contains the barcode scanning listener.
 * Based on the method from https://stackoverflow.com/a/55251571
 */

// Barcode pattern.
const pattern = /^(!BA11|!BA10|!BA)(?<code>.+)!C$/;

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
    constructor(timeoutLimit = null) {
        if (timeoutLimit !== null && !Number.isInteger(timeoutLimit)) {
            throw new Error("timeoutLimit must be an integer");
        }

        this.code = "";
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
        console.log(this.code);
        console.log("#################");
        if (this.resultCallback === null) {
            return;
        }

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }

        if (this.code.length > 0) {
            const matches = pattern.exec(this.code);

            if (matches !== null && matches.groups.code) {
                this.resultCallback(matches.groups.code);
                this.code = "";
            }
        } else {
            this.code = "";
        }
    }

    /**
     * Registers key presses.
     *
     * @param event
     */
    handleKeypress(event) {
        console.log(event.keyCode);
        this.code += event.key;

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
        // TODO TROELS I did this for testing purposes
        if (this.timeoutLimit === 0) {
            this.result();
        } else {
            this.timeout = setTimeout(this.result, this.timeoutLimit);
        }
    }

    /**
     * Start listening for key presses.
     *
     * @param resultCallback
     *   The callback function to invoke when a result has been registered.
     */
    start(resultCallback) {
        this.code = "";
        this.resultCallback = resultCallback;
        document.addEventListener("keypress", this.handleKeypress);
    }

    /**
     * Stop listening for key presses.
     */
    stop() {
        document.removeEventListener("keypress", this.handleKeypress);
        this.resultCallback = null;

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}

export default BarcodeScanner;
