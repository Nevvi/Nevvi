import React, {Component} from 'react';
import history from '../../History'

import {Button, Nav, Navbar} from "react-bootstrap";

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.logoutAccount = this.logoutAccount.bind(this);
    }

    async logoutAccount(event) {
        event.preventDefault()
        await this.props.logOut()
    }

    render() {
        const isLoggedIn = this.props.loggedIn

        const navs = isLoggedIn ?
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => {history.push('/')}}>Home</Nav.Link>
                        <Nav.Link onClick={() => {history.push('/account')}}>Account</Nav.Link>
                    </Nav>
                    <Nav>
                        <Button variant="link" onClick={this.logoutAccount}>Logout</Button>
                    </Nav>
                </Navbar.Collapse>
            :
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => {history.push('/')}}>Home</Nav.Link>
                    </Nav>
                    <Nav>
                        <Button variant="link" onClick={() => {history.push('/login')}}>Login</Button>
                    </Nav>
                </Navbar.Collapse>

        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand onClick={() => {history.push('/')}}>Nevvi</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                {navs}
            </Navbar>
        )
    }
}

export default NavigationBar;