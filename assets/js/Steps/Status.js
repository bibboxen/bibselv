import React, { useEffect } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import BarcodeScanner from './BarcodeScanner';
import PropTypes from 'prop-types';
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_COMMAND_LENGTH,
    BARCODE_SCANNING_TIMEOUT
} from '../constants';

/**
 * Status component.
 *
 * Supplies a page for viewing status.
 *
 * @param props
 * @return {*}
 * @constructor
 */
function Status(props) {
    const { actionHandler, handleReset } = props;

    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);

        const barcodeCallback = code => {
            if (code.length === BARCODE_COMMAND_LENGTH) {
                if (code === BARCODE_COMMAND_FINISH) {
                    handleReset();
                }
            }
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
            <h1>Status</h1>

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
                    <h2>Hold items</h2>

                    <Table striped={true} bordered={true}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>title</th>
                                <th>author</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.machineState.holdItems && props.machineState.holdItems.map(
                                    item => <tr key={'holdItems-' + item.itemIdentifier}>
                                        <td>{item.itemIdentifier}</td>
                                        <td>{item.title}</td>
                                        <td>{item.author}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Overdue items</h2>

                    <Table striped={true} bordered={true}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>title</th>
                                <th>author</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.machineState.overdueItems && props.machineState.overdueItems.map(
                                    item => <tr key={'overdueItems-' + item.itemIdentifier}>
                                        <td>{item.itemIdentifier}</td>
                                        <td>{item.title}</td>
                                        <td>{item.author}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Charged items</h2>

                    <Table striped={true} bordered={true}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>title</th>
                                <th>author</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.machineState.chargedItems && props.machineState.chargedItems.map(
                                    item => <tr key={'chargedItems-' + item.itemIdentifier}>
                                        <td>{item.itemIdentifier}</td>
                                        <td>{item.title}</td>
                                        <td>{item.author}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Fine items</h2>

                    <Table striped={true} bordered={true}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>title</th>
                                <th>author</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.machineState.fineItems && props.machineState.fineItems.map(
                                    item => <tr key={'fineItems-' + item.itemIdentifier}>
                                        <td>{item.itemIdentifier}</td>
                                        <td>{item.title}</td>
                                        <td>{item.author}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Recall items</h2>

                    <Table striped={true} bordered={true}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>title</th>
                                <th>author</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.machineState.recallItems && props.machineState.recallItems.map(
                                    item => <tr key={'recallItems-' + item.itemIdentifier}>
                                        <td>{item.itemIdentifier}</td>
                                        <td>{item.title}</td>
                                        <td>{item.author}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Unavailable Hold Items</h2>

                    <Table striped={true} bordered={true}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>title</th>
                                <th>author</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.machineState.unavailableHoldItems && props.machineState.unavailableHoldItems.map(
                                    item => <tr key={'unavailableHoldItems-' + item.itemIdentifier}>
                                        <td>{item.itemIdentifier}</td>
                                        <td>{item.title}</td>
                                        <td>{item.author}</td>
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

Status.propTypes = {
    actionHandler: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    machineState: PropTypes.object.isRequired
};

export default Status;
