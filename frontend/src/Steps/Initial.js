import React, { useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';

function Initial(props) {
    const barcodeScanner = new BarcodeScanner(400);

    const enterFlow = (flow) => {
        props.actionHandler('enterFlow', {
            flow: flow
        });
    };

    useEffect(() => {
        console.log('use effect');
        const barcodeCallback = code => {
            // Commands are 5 characters long.
            if (code.length <= 5) {
                if (code === '03009') {
                    enterFlow('borrow');
                }
            }
        };

        barcodeScanner.start(barcodeCallback);
        return () => barcodeScanner.stop();
    }, [barcodeScanner]);

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
                    <Button type={'primary'} onClick={() => enterFlow('borrow')}>
                        Lån
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Initial;
