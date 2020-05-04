const pattern = /^(!BA11|!BA10|!BA)(?<code>.+)!C$/;

/**
 * Class to receive results from a barcode scanner.
 * Based on the method from https://stackoverflow.com/a/55251571
 */
export class BarcodeScanner {
    constructor (timeoutLimit) {
        this.code = '';
        this.timeoutLimit = timeoutLimit;
        this.resultCallback = null;
        this.timeout = null;
    }

    result() {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }

        if (this.code.length > 0) {
            let matches = pattern.exec(this.code);

            if (matches !== null && matches.groups.code) {
                this.resultCallback(matches.groups.code);
                this.code = '';
            }
        }
        else {
            this.code = '';
        }
    }

    handleKeypress(event) {
        this.code += event.key;

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.result.bind(this), this.timeoutLimit);
    }

    start(resultCallback) {
        this.code = '';
        this.resultCallback = resultCallback;
        document.addEventListener('keypress', this.handleKeypress.bind(this));
    }

    stop() {
        document.removeEventListener('keypress', this.handleKeypress);

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}

export default BarcodeScanner;
