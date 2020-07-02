import BarcodeScanner from './BarcodeScanner';

it('can be created', () => {
    new BarcodeScanner();
});

it('can be created with a timeout limit', () => {
    new BarcodeScanner(1000);
});

it('can not be created with string', () => {
    expect(() => {
        new BarcodeScanner('test')
    }).toThrow('timeoutLimit must be an integer');
});
