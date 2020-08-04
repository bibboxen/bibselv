import React, { useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';
import PropTypes from 'prop-types';
import {
    BARCODE_COMMAND_CHECKIN,
    BARCODE_COMMAND_CHECKOUT,
    BARCODE_COMMAND_LENGTH,
    BARCODE_COMMAND_STATUS,
    BARCODE_SCANNING_TIMEOUT
} from '../constants';

/**
 * Initial component.
 *
 * Supplies a front page.
 *
 * @param props
 * @return {*}
 * @constructor
 */
function Initial(props) {
    const { actionHandler } = props;

    // Setup component.
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);

        const barcodeCallback = code => {
            // Commands are 5 characters long.
            if (code.length === BARCODE_COMMAND_LENGTH) {
                if (code === BARCODE_COMMAND_CHECKOUT) {
                    actionHandler('enterFlow', {
                        flow: 'checkOutItems'
                    });
                }

                if (code === BARCODE_COMMAND_CHECKIN) {
                    actionHandler('enterFlow', {
                        flow: 'checkInItems'
                    });
                }

                if (code === BARCODE_COMMAND_STATUS) {
                    actionHandler('enterFlow', {
                        flow: 'status'
                    });
                }
            }
        };

        barcodeScanner.start(barcodeCallback);

        // Stop scanning when component is unmounted.
        return () => barcodeScanner.stop();
    }, [actionHandler]);

    return (
        <Container>
            <h1>Vælg handling</h1>

            <Row>
                <Col>
                    <Alert variant={'info'}>Skan handling eller tryk på en knap.</Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button type={'primary'} onClick={() => actionHandler('enterFlow', { flow: 'checkOutItems' }) }>
                        Lån
                    </Button>
                </Col>
                <Col>
                    <Button type={'primary'} onClick={() => actionHandler('enterFlow', { flow: 'status' }) }>
                        Status
                    </Button>
                </Col>
                <Col>
                    <Button type={'primary'} onClick={() => actionHandler('enterFlow', { flow: 'checkInItems' }) }>
                        Aflevér
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

Initial.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default Initial;
