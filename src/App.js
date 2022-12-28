import React, {Component} from 'react';
import {router} from './router'

import {
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import {inject, observer} from "mobx-react";

// UIs
import Account from './components/account/Account.js';

// Auth
import CreateAccount from './components/authentication/CreateAccount.js';
import ConfirmAccount from "./components/authentication/ConfirmAccount";
import Login from './components/authentication/Login.js';
import UserTable from "./components/connections/UserTable";
import Connections from "./components/connections/Connections";
import Navigation from "./components/navbar/Navigation";
import {Grid, Stack} from "@mui/material";
import Onboarding from "./components/onboarding/Onboarding";
import Connection from "./components/connections/Connection";


const InsecureRoute = inject("authStore")(observer(({authStore, component: Component, ...rest}) => (
    <Route {...rest} render={(props) => {
        return (!authStore.isLoggedIn
            ? <Component {...rest} />
            : <Redirect to='/'/>)
    }}/>
)))

const SecureRoute = inject("authStore")(observer(({authStore, component: Component, ...rest}) => (
    <Route {...rest} render={(props) => {
        return (authStore.isLoggedIn
            ? <Component {...rest} />
            : <Redirect to='/createAccount'/>)
    }}/>
)))

class App extends Component {
    componentDidMount() {
        const {authStore} = this.props
        authStore.reload()
    }

    render() {
        return (
            <Stack direction={{sm: "column", md: "row"}}>
                <Navigation/>
                <Grid container className="app-container">
                    <Switch location={router.location}>
                        <SecureRoute path="/" exact={true} component={Connections}/>
                        <SecureRoute path="/onboarding" exact={true} component={Onboarding}/>
                        <SecureRoute path="/account" exact={true} component={Account}/>
                        <SecureRoute path="/connections" exact={true} component={Connections}/>
                        <SecureRoute path="/connections/new" exact={true} component={UserTable}/>
                        <SecureRoute path="/connections/:userId" exact={true} component={Connection}/>
                        <InsecureRoute path="/createAccount" component={CreateAccount}/>
                        <InsecureRoute path="/confirmAccount" component={ConfirmAccount}/>
                        <InsecureRoute path="/login" component={Login}/>
                    </Switch>
                </Grid>
            </Stack>
        )
    }
}

export default observer(App);