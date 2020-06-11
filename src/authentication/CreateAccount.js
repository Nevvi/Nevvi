import React, {Component} from 'react';
import axios from 'axios';
import history from '../History'
import {Button, Col, Form} from "react-bootstrap";

class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};

        this.handleChange = this.handleChange.bind(this);
        this.createAccount = this.createAccount.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async registerAccount(username, password) {
        try {
            // Create the account
            await axios.post(
                `/api/authentication/v1/register`,
                {username, password}
            )

            // Log in to the account
            await this.props.login(username, password)

            // Default go back to the home page
            history.push('/')
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            alert(message)
            this.setState({username: '', password: ''})
        }
    }

    async createAccount(event) {
        event.preventDefault()
        await this.registerAccount(this.state.username, this.state.password)
    }

    render() {
        const isDisabled = this.state.username === '' || this.state.password === ''
        return (
            <Col md={{ span: 2 }}>
                <Form>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" onChange={this.handleChange} name="username" value={this.state.username}/>
                        <Form.Text className="text-muted">
                            You will use this to login.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={this.handleChange} name="password" value={this.state.password}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isDisabled} onClick={this.createAccount}>Create Account</Button>
                </Form>
            </Col>
        );
    }
}

export default CreateAccount;