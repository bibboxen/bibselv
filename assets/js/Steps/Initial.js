import React, { useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';
import PropTypes from 'prop-types';

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
        console.log('use effect');

        const barcodeScanner = new BarcodeScanner(400);

        const barcodeCallback = code => {
            console.log('barcodeCallback');

            // Commands are 5 characters long.
            if (code.length <= 5) {
                if (code === '03009') {
                    actionHandler('enterFlow', {
                        flow: 'borrow'
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
                    <Button type={'primary'} onClick={() => actionHandler('enterFlow', { flow: 'borrow' }) }>
                        Lån
                    </Button>
                </Col>
                <Col>
                    <Button type={'primary'} onClick={() => actionHandler('enterFlow', { flow: 'returnMaterials' }) }>
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
