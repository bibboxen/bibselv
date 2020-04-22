import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import {Container, Row, Col} from 'react-bootstrap';

class Initial extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        const {actionHandler} = this.props;
        return (
            <Container>
                <h1>Vælg handling</h1>
                <Row>
                    <Col>
                        <Button type={'primary'} onClick={() => actionHandler('enterFlow', { flow: 'borrow' })}>Lån</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Initial;
