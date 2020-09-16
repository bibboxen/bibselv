/**
 * @file
 * Tests of BarcodeScanner class.
 */

import BarcodeScanner from './BarcodeScanner';
import { expect, it } from '@jest/globals';

it('can be created', () => {
    // eslint-disable-next-line no-unused-vars
    const barcodeScanner = new BarcodeScanner();
});

it('can be created with a timeout limit', () => {
    // eslint-disable-next-line no-unused-vars
    const barcodeScanner = new BarcodeScanner(1000);
});

it('can not be created with string', () => {
    expect(() => {
        // eslint-disable-next-line no-unused-vars
        const barcodeScanner = new BarcodeScanner('test');
    }).toThrowError(Error('timeoutLimit must be an integer'));
});
