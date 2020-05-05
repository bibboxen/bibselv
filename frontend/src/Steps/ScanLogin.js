import React, { useState, useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';

function ScanLogin(props) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const stateRef = useRef({});
    const { actionHandler } = props;

    stateRef.current.username = username;

    useEffect(() => {
        console.log('use effect');

        const barcodeScanner = new BarcodeScanner(400);

        const barcodeCallback = code => {
            console.log('barcodeCallback');

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
    }, [actionHandler, setLoading, setUsername]);

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
