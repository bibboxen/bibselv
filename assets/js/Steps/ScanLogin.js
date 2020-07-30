import React, { useState, useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';
import PropTypes from 'prop-types';
import { BARCODE_COMMAND_FINISH, BARCODE_SCANNING_TIMEOUT } from '../constants';

/**
 * Scan login component.
 *
 * Supplies a page for scanning login.
 *
 * @param props
 * @return {*}
 * @constructor
 */
function ScanLogin(props) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const stateRef = useRef({});
    const { actionHandler, handleReset } = props;

    stateRef.current.username = username;

    // Setup component.
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);

        const barcodeCallback = code => {
            if (code === BARCODE_COMMAND_FINISH) {
                handleReset();
            }

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

        // Stop scanning when component is unmounted.
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

ScanLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default ScanLogin;
