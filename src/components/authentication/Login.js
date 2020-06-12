import React, {Component} from 'react';
import history from '../../History'
import {Button, Col, Form} from "react-bootstrap";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};

        this.handleChange = this.handleChange.bind(this);
        this.loginAccount = this.loginAccount.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async loginAccount(event) {
        event.preventDefault()
        try {
            await this.props.login(this.state.username, this.state.password)
            history.push('/')
        } catch (e) {
            alert(e)
            this.setState({username: '', password: ''})
        }
    }

    render() {
        const isDisabled = this.state.username === '' || this.state.password === ''
        return (
            <Col md={{span: 2}}>
                <Form>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" onChange={this.handleChange}
                                      name="username" value={this.state.username}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={this.handleChange}
                                      name="password" value={this.state.password}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isDisabled} onClick={this.loginAccount}>Login</Button>
                </Form>
            </Col>
        );
    }
}

export default Login;