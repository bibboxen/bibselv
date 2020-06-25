import React, { useEffect } from 'react';
import { Container, Row, Col, Alert, Table, Button } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';

function Borrow (props) {
    const { actionHandler, handleReset } = props;

    useEffect(() => {
        console.log('use effect');

        let barcodeScanner = new BarcodeScanner(400);

        const barcodeCallback = code => {
            console.log('barcodeCallback');

            // Commands are 5 characters long.
            if (code.length <= 5) {
                if (code === '03006') {
                    handleReset();
                }
                return;
            }

            actionHandler('borrowMaterial', {
                itemIdentifier: code
            });
        };

        barcodeScanner.start(barcodeCallback);
        return () => {
            barcodeScanner.stop();
        }
    }, [actionHandler, handleReset]);

    // Return nothing if no machineState is set.
    if (!Object.prototype.hasOwnProperty.call(props, 'machineState')) {
        return;
    }

    return (
        <Container>
            <h1>Borrow</h1>

            {props.machineState.user &&
                <div>
                    <p>Hej {props.machineState.user.name}</p>
                    {props.machineState.user.birthdayToday &&
                    <p>Tillykke med fødselsdagen</p>
                    }
                </div>
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
