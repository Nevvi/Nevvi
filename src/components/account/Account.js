import React, {Component} from 'react';
import Loading from "../loading/Loading";
import {Button, Col, Form} from "react-bootstrap";
import {inject, observer} from "mobx-react";

class Account extends Component {
    constructor(props) {
        super(props);

        this.updateAccount = this.updateAccount.bind(this);
    }

    componentDidMount() {
        const {authStore, accountStore} = this.props;
        accountStore.getUser(authStore.userId)
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
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label> Email ({user.emailVerified ? 'verified' : 'unverified'}) </Form.Label>
                        <Form.Control type="text" placeholder="Email" value={user.email} readOnly/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPhone">
                        <Form.Label>Phone ({user.phoneVerified ? 'verified' : 'unverified'})</Form.Label>
                        <Form.Control type="text" placeholder="Phone Number" value={user.phone} readOnly/>
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Name" value={user.name} onChange={(e) => accountStore.updateUser("name", e.target.value)}/>
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