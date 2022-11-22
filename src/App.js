import React, {Component} from 'react';
import {router} from './router'

import {
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import {inject, observer} from "mobx-react";

// UIs
import Home from './components/home/Home.js';
import Account from './components/account/Account.js';

// Auth
import CreateAccount from './components/authentication/CreateAccount.js';
import ConfirmAccount from "./components/authentication/ConfirmAccount";
import Login from './components/authentication/Login.js';
import UserTable from "./components/connections/UserTable";
import Connections from "./components/connections/Connections";


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
            : <Redirect to='/'/>)
    }}/>
)))

class App extends Component {

    componentDidMount() {
        const {authStore} = this.props
        authStore.reload()
    }

    render() {
        return (
            <Switch location={router.location}>
                <Route exact path="/"> <Home/> </Route>
                <SecureRoute path="/account" component={Account}/>
                <SecureRoute path="/connections" exact={true} component={Connections}/>
                <SecureRoute path="/connections/new" exact={true} component={UserTable}/>
                <InsecureRoute path="/createAccount" component={CreateAccount}/>
                <InsecureRoute path="/confirmAccount" component={ConfirmAccount}/>
                <InsecureRoute path="/login" component={Login}/>
            </Switch>
        )
    }
}

export default observer(App);