import React, { useState, useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';

function ScanLogin(props) {
    const barcodeScanner = new BarcodeScanner(400);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const stateRef = useRef({});

    stateRef.current.username = username;

    useEffect(() => {
        console.log('use effect');

        const barcodeCallback = code => {
            if (stateRef.current.username === '') {
                setUsername(code);
                setLoading(true);
                actionHandler('login', {
                    username: code,
                    password: ''
                });
            }
        };

        barcodeScanner.start(barcodeCallback);
        return () => barcodeScanner.stop();
    }, [barcodeScanner, actionHandler]);

    return (
        <Container>
            <h1>ScanLogin</h1>

            <div>Username: {username}</div>

            {loading &&
                <Spinner animation={'grow'} size={'m'} variant={'primary'} />
            }
        </Container>
    );
}

export default ScanLogin;
