import BarcodeScanner from './BarcodeScanner';
import { expect, it } from '@jest/globals';

it('can be created', () => {
    BarcodeScanner.constructor();
});

it('can be created with a timeout limit', () => {
    BarcodeScanner.constructor(1000);
});

it('can not be created with string', () => {
    expect(() => {
        BarcodeScanner.constructor('test');
    }).toThrow('timeoutLimit must be an integer');
});
