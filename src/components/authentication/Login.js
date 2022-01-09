import React, {Component} from 'react';
import {Button, Col, Form} from "react-bootstrap";
import Loading from "../loading/Loading";
import {inject, observer} from "mobx-react";

class Login extends Component {
    constructor(props) {
        super(props);
        this.loginAccount = this.loginAccount.bind(this);
    }

    async loginAccount(event) {
        event.preventDefault()
        const {loginStore} = this.props;
        await loginStore.login()
    }

    render() {
        const {loginStore} = this.props;
        const isDisabled = loginStore.username === '' || loginStore.password === ''
        return (
            <Col md={{span: 2}}>
                <Form>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Enter username"
                                      onChange={(e) => loginStore.setUsername(e.target.value)}
                                      value={loginStore.username}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password"
                                      onChange={(e) => loginStore.setPassword(e.target.value)}
                                      value={loginStore.password}/>
                    </Form.Group>
                    <Loading
                        component={<Button variant="primary" type="submit" disabled={isDisabled} onClick={this.loginAccount}>Login</Button>}
                        loading={loginStore.loading}
                    />
                </Form>
            </Col>
        );
    }
}

export default inject('loginStore')(observer(Login));