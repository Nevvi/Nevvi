import React, {Component} from 'react';

import {Nav, Navbar} from "react-bootstrap";
import {Button} from "@mui/material";
import {inject, observer} from "mobx-react";

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleRoute = this.handleRoute.bind(this);
        this.logoutAccount = this.logoutAccount.bind(this);

        this.state = {
            isNavExpanded: false
        };
    }

    setIsNavExpanded(isNavExpanded) {
        this.setState({isNavExpanded: isNavExpanded});
    }

    handleClick(e) {
        if (this.node.contains(e.target)) {
            // if clicked inside menu do something
        } else {
            // If clicked outside menu, close the navbar.
            this.setState({isNavExpanded: false});
        }
    }

    handleRoute(route) {
        const {routingStore} = this.props;
        routingStore.push(route)
        this.setIsNavExpanded(false)
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
    }

    async logoutAccount(event) {
        event.preventDefault()
        await this.props.authStore.logout()
        this.props.routingStore.push("/")
    }

    render() {
        const {authStore} = this.props

        const navs = authStore.isLoggedIn ?
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto" style={{textAlign: "center"}}>
                    <Nav.Link onClick={() => {this.handleRoute('/')}}>Home</Nav.Link>
                    <Nav.Link onClick={() => {this.handleRoute('/account')}}>Account</Nav.Link>
                    <Nav.Link onClick={() => {this.handleRoute('/payment')}}>Payment</Nav.Link>
                </Nav>
                <Nav>
                    <Button variant="text" color="primary" onClick={this.logoutAccount}>Logout</Button>
                </Nav>
            </Navbar.Collapse> :
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto" style={{textAlign: "center"}}>
                    <Nav.Link onClick={() => {this.handleRoute('/')}}>Home</Nav.Link>
                </Nav>
                <Nav>
                    <Button variant="text" color="primary" onClick={() => {this.handleRoute('/login')}}>Login</Button>
                </Nav>
            </Navbar.Collapse>

        return (
            <div ref={node => this.node = node}>
                <Navbar bg="light" expand="lg" collapseOnSelect expanded={this.state.isNavExpanded}>
                    <Navbar.Brand onClick={() => {this.handleRoute('/')}}>Nevvi</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => this.setIsNavExpanded(!this.state.isNavExpanded)}/>
                    {navs}
                </Navbar>
            </div>
        )
    }
}

export default inject("routingStore", "authStore")(observer(NavigationBar));