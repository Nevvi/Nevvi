import React, {Component} from 'react';
import {Button, Col, Form} from "react-bootstrap";
import Loading from "../loading/Loading";
import {inject, observer} from "mobx-react";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: '', loading: undefined, done: undefined};

        this.handleChange = this.handleChange.bind(this);
        this.loginAccount = this.loginAccount.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async loginAccount(event) {
        event.preventDefault()
        const {authStore, routingStore} = this.props;
        try {
            this.setState({loading: true})
            await authStore.login(this.state.username, this.state.password)
            routingStore.push('/')
        } catch (e) {
            this.setState({username: '', password: '', loading: undefined})
            alert(e)
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
                    <Loading
                        component={<Button variant="primary" type="submit" disabled={isDisabled} onClick={this.loginAccount}>Login</Button>}
                        loading={this.state.loading}
                        done={this.state.done}
                    />
                </Form>
            </Col>
        );
    }
}

export default inject('routingStore', 'authStore')(observer(Login));