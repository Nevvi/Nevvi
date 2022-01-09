import React, {Component} from 'react';
import {Button, Col, Form} from "react-bootstrap";
import Loading from "../loading/Loading";
import {inject, observer} from "mobx-react";

class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.createAccount = this.createAccount.bind(this);
    }

    async createAccount(event) {
        event.preventDefault()
        const {createAccountStore} = this.props
        await createAccountStore.createAccount()
    }

    render() {
        const {createAccountStore} = this.props
        const isDisabled = createAccountStore.username === '' || createAccountStore.password === ''

        return (
            <Col md={{ span: 2 }}>
                <Form>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Enter username"
                                      onChange={(e) => createAccountStore.setUsername(e.target.value)}
                                      value={createAccountStore.username}/>
                        <Form.Text className="text-muted">
                            You will use this to login.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"
                                      placeholder="Password"
                                      onChange={(e) => createAccountStore.setPassword(e.target.value)}
                                      value={createAccountStore.password}/>
                    </Form.Group>
                    <Loading
                        component={<Button variant="primary" type="submit" disabled={isDisabled} onClick={this.createAccount}>Create Account</Button>}
                        loading={createAccountStore.loading}
                    />
                </Form>
            </Col>
        );
    }
}

export default inject('createAccountStore')(observer(CreateAccount));