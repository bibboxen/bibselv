import React, { useState, useEffect, useRef } from 'react';
import { Button, Container, Spinner } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';
import PropTypes from 'prop-types';

function ScanLogin(props) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const stateRef = useRef({});
    const { actionHandler, machineState } = props;

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

            {machineState && machineState.fake &&
                <Button variant={'warning'} onClick={() => actionHandler('login', { username: '1234567890', password: '12345' }) }>
                    Fake login
                </Button>
            }

            {loading &&
                <Spinner animation={'grow'} size={'m'} variant={'primary'} />
            }
        </Container>
    );
}

ScanLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired,
    machineState: PropTypes.object
};

export default ScanLogin;
