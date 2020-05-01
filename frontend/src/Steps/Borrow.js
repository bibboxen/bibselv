import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';

function Borrow (props) {
    const barcodeScanner = new BarcodeScanner(400);

    const barcodeCallback = code => {
        props.actionHandler('borrowMaterial', {
            itemIdentifier: code
        });
    };

    useEffect(() => {
        barcodeScanner.start(barcodeCallback);
        return () => barcodeScanner.stop();
    }, []);

    return (
        <Container>
            <h1>Borrow</h1>

            <p>Hej {props.machineState.user.name}</p>
            <p>med fødselsdato {props.machineState.user.birthday}</p>
            <Row>
                <Col>
                    <Alert variant={'info'}>Skan materialer</Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Materials</h2>
                    {
                        props.machineState.materials && props.machineState.materials.map(
                            el => <div key={'material-'+el.itemIdentifier}><span>ID: {el.itemIdentifier}</span> - <span>Status: {el.status}</span></div>
                        )
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant={'primary'} onClick={props.handleReset}>Gå tilbage til menuen</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Borrow;
