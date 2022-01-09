import React, {Component} from 'react';
import Loading from "../loading/Loading";
import {Button, Col, Form} from "react-bootstrap";
import {inject, observer} from "mobx-react";

class Account extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.updateAccount = this.updateAccount.bind(this);
    }

    componentDidMount() {
        const {authStore, accountStore} = this.props;
        accountStore.getUser(authStore.userId)
    }

    handleChange(event) {
        const {accountStore} = this.props;
        accountStore.updateUser(event.target.name, event.target.value)
    }

    async updateAccount(event) {
        event.preventDefault()
        const {accountStore} = this.props;
        await accountStore.saveUser()
    }

    render() {
        // Initial page load
        const {accountStore} = this.props;
        const user = accountStore.user;
        if (!user) {
            return <Loading component={<div/>} loading={accountStore.loading}/>
        }

        // Subsequent page load
        return (
            <Col md={{ span: 4 }}>
                <Form>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Username" name="username" value={user.username} readOnly/>
                    </Form.Group>
                    <Form.Group controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="First Name" name="firstName" onChange={this.handleChange} value={user.firstName}/>
                    </Form.Group>
                    <Form.Group controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Last Name" name="lastName" onChange={this.handleChange} value={user.lastName}/>
                    </Form.Group>
                    <Loading
                        component={<Button variant="primary" type="submit" onClick={this.updateAccount}>Update</Button>}
                        loading={accountStore.loading}
                    />
                </Form>
            </Col>
        )
    }
}

export default inject("authStore", "accountStore")(observer(Account));