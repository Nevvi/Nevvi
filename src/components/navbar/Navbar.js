import React, {Component} from 'react';

import {Button, Nav, Navbar} from "react-bootstrap";
import {inject, observer} from "mobx-react";

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.logoutAccount = this.logoutAccount.bind(this);
    }

    async logoutAccount(event) {
        event.preventDefault()
        await this.props.authStore.logout()
        this.props.routingStore.push("/")
    }

    render() {
        const { routingStore, authStore } = this.props

        const navs = authStore.isLoggedIn ?
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => {routingStore.push('/')}}>Home</Nav.Link>
                        <Nav.Link onClick={() => {routingStore.push('/account')}}>Account</Nav.Link>
                        <Nav.Link onClick={() => {routingStore.push('/payment')}}>Payment</Nav.Link>
                    </Nav>
                    <Nav>
                        <Button variant="link" onClick={this.logoutAccount}>Logout</Button>
                    </Nav>
                </Navbar.Collapse>
            :
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => {routingStore.push('/')}}>Home</Nav.Link>
                    </Nav>
                    <Nav>
                        <Button variant="link" onClick={() => {routingStore.push('/login')}}>Login</Button>
                    </Nav>
                </Navbar.Collapse>

        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand onClick={() => {routingStore.push('/')}}>Nevvi</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                {navs}
            </Navbar>
        )
    }
}

export default inject("routingStore", "authStore")(observer(NavigationBar));