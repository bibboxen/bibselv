import React, { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';

function ScanLogin(props) {
    const barcodeScanner = new BarcodeScanner(400);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const stateRef = useRef({});

    stateRef.current.username = username;
    stateRef.current.password = username;

    const barcodeCallback = code => {
        if (stateRef.current.username === '') {
            setUsername(code);
            props.actionHandler('login', {
                username: code,
                password: ''
            });
        }
    };

    useEffect(() => {
        barcodeScanner.start(barcodeCallback);
        return () => barcodeScanner.stop();
    }, []);

    return (
        <Container>
            <h1>ScanLogin</h1>

            <div>Username: {username}</div>
        </Container>
    );
}

export default ScanLogin;
