import React, { useEffect } from 'react';
import { Container, Row, Col, Alert, Table, Button } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';
import PropTypes from 'prop-types';
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_COMMAND_LENGTH,
    BARCODE_SCANNING_TIMEOUT
} from '../constants';

/**
 * CheckInItems component.
 *
 * Supplies a page for returning materials.
 *
 * @param props
 * @return {*}
 * @constructor
 */
function CheckInItems(props) {
    const { actionHandler, handleReset } = props;

    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);

        const barcodeCallback = code => {
            if (code.length === BARCODE_COMMAND_LENGTH) {
                if (code === BARCODE_COMMAND_FINISH) {
                    handleReset();
                }
                return;
            }

            actionHandler('checkInItem', {
                itemIdentifier: code
            });
        };

        barcodeScanner.start(barcodeCallback);
        return () => {
            barcodeScanner.stop();
        };
    }, [actionHandler, handleReset]);

    // Return nothing if no machineState is set.
    if (!Object.prototype.hasOwnProperty.call(props, 'machineState')) {
        return;
    }

    return (
        <Container>
            <h1>Return</h1>

            <Row>
                <Col>
                    <Alert variant={'info'}>Skan materialer</Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Items</h2>

                    <Table striped={true} bordered={true}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>title</th>
                                <th>author</th>
                                <th>status</th>
                                <th>message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.machineState.items && props.machineState.items.map(
                                    item => <tr key={'item-' + item.itemIdentifier}>
                                        <td>{item.itemIdentifier}</td>
                                        <td>{item.title}</td>
                                        <td>{item.author}</td>
                                        <td>{item.status}</td>
                                        <td>{item.message}</td>
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

CheckInItems.propTypes = {
    actionHandler: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    machineState: PropTypes.object.isRequired
};

export default CheckInItems;
