import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import {Container, Row, Col} from 'react-bootstrap';

class Borrow extends Component {
    constructor (props) {
        super(props);

        this.state = {
            materialId: ''
        };

        this.handleBorrow = this.handleBorrow.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleBorrow () {
        this.props.actionHandler('borrowMaterial', {
            id: this.state.materialId
        });
    }

    handleChange(event) {
        const key = event.target.id;
        this.setState({[key]: event.target.value});
    }

    render () {
        return (
            <Container>
                <h1>Borrow</h1>
                <Row>
                    <Col>
                        <input id={'materialId'} onChange={this.handleChange} />
                        <Button variant={'primary'} onClick={this.handleBorrow}>Send</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Materials</h2>
                        {
                            this.props.machineState.materials && this.props.machineState.materials.map(
                                el => <div key={'material-'+el.id}><span>ID: {el.id}</span> - <span>Status: {el.status}</span></div>
                            )
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant={'primary'} onClick={this.props.handleReset}>Gå tilbage til menuen</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Borrow;
