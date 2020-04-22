import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { Container, Row, Col, Alert } from 'react-bootstrap';

class ScanLogin extends Component {
    constructor (props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        if (this.state.username.length === 8 && this.state.password.length === 8) {
            return;
        }

        const key = event.target.id;
        this.setState({[key]: event.target.value}, () => {
            if (this.state.username.length === 8 && this.state.password.length === 8) {
                this.props.actionHandler('login', {
                    username: this.state.username,
                    password: this.state.password
                });
            }
        });
    }

    render () {
        const username = this.state.username;
        const password = this.state.password;

        return (
            <Container>
                <h1>ScanLogin</h1>

                {username.length < 8 ?
                    <Alert variant={'info'}>Skan brugernavn</Alert> :
                    password.length < 8 ?
                        <Alert variant={'info'}>Skan kode</Alert>
                        :
                        <Alert variant={'warning'}>Behandler...</Alert>
                }

                {username.length < 8 &&
                    <input id={'username'} type={'text'} onChange={this.handleChange}  />
                }
                {username.length === 8 && password.length < 8 &&
                    <input id={'password'} type={'text'} onChange={this.handleChange}/>
                }
            </Container>
        );
    }
}

export default ScanLogin;
