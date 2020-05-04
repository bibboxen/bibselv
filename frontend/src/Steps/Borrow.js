import React, { useEffect } from 'react';
import { Container, Row, Col, Alert, Table, Button } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';

function Borrow (props) {
    const barcodeScanner = new BarcodeScanner(400);

    const barcodeCallback = code => {
        // Commands are 5 characters long.
        if (code.length <= 5) {
            if (code === '03006') {
                props.handleReset();
            }
            return;
        }

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
            {props.machineState.user.birthdayToday &&
                <p>Tillykke med fødselsdagen</p>
            }
            <Row>
                <Col>
                    <Alert variant={'info'}>Skan materialer</Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Materials</h2>

                    <Table striped={true} bordered={true}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>title</th>
                                <th>author</th>
                                <th>status</th>
                                <th>renewalOk</th>
                                <th>message</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            props.machineState.materials && props.machineState.materials.map(
                                el => <tr key={'material-'+el.itemIdentifier}>
                                    <td>{el.itemIdentifier}</td>
                                    <td>{el.title}</td>
                                    <td>{el.author}</td>
                                    <td>{el.status}</td>
                                    <td>{el.renewalOk}</td>
                                    <td>{el.message}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant={'primary'} onClick={props.handleReset}>
                        Tilbage
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Borrow;
