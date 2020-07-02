const pattern = /^(!BA11|!BA10|!BA)(?<code>.+)!C$/;

/**
 * Class to receive results from a barcode scanner.
 * Based on the method from https://stackoverflow.com/a/55251571
 */
export class BarcodeScanner {
    constructor(timeoutLimit) {
        this.code = '';
        this.timeoutLimit = timeoutLimit;
        this.resultCallback = null;
        this.timeout = null;

        this.handleKeypress = this.handleKeypress.bind(this);
        this.result = this.result.bind(this);
    }

    result() {
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
                this.code = '';
            }
        } else {
            this.code = '';
        }
    }

    handleKeypress(event) {
        this.code += event.key;

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.result, this.timeoutLimit);
    }

    start(resultCallback) {
        this.code = '';
        this.resultCallback = resultCallback;
        document.addEventListener('keypress', this.handleKeypress);
    }

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
