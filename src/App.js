import React, {Component} from 'react';
import {router} from './router'
import {Box, CssBaseline, ThemeProvider} from '@mui/material';
import theme from './theme/theme';

import {Redirect, Route, Switch,} from "react-router-dom";

import {inject, observer} from "mobx-react";

// UIs
import Account from './components/account/Account.js';
import PermissionGroups from './components/account/PermissionGroups.js';
import BlockedUsers from "./components/account/BlockedUsers";
import Help from './components/admin/Help.js';

// Auth
import CreateAccount from './components/authentication/CreateAccount.js';
import ConfirmAccount from "./components/authentication/ConfirmAccount";
import Login from './components/authentication/Login.js';
import ForgotPassword from './components/authentication/ForgotPassword.js';
import UserTable from "./components/connections/UserTable";
import Connections from "./components/connections/Connections";
import Onboarding from "./components/onboarding/Onboarding";
import Connection from "./components/connections/Connection";
import ConnectionGroups from "./components/connections/ConnectionGroups";
import ConnectionGroup from "./components/connections/ConnectionGroup";
import AppLayout from "./components/layout/AppLayout";
import Home from "./components/home/Home";


const SharedRoute = inject("authStore")(observer(({authStore, component: Component, ...rest}) => (
    <Route {...rest} render={(props) => {
        return (authStore.isLoggedIn
            ? <AppLayout><Component {...rest} /></AppLayout>
            : <Component {...rest} />)
    }}/>
)))

const HomeRoute = inject("authStore")(observer(({authStore, component: Component, ...rest}) => (
    <Route {...rest} render={(props) => {
        return (authStore.isLoggedIn
            ? <Redirect to='/connections'/>
            : <Component {...rest} />)
    }}/>
)))

const InsecureRoute = inject("authStore")(observer(({authStore, component: Component, ...rest}) => (
    <Route {...rest} render={(props) => {
        return (!authStore.isLoggedIn
            ? <Component {...rest} />
            : <Redirect to='/'/>)
    }}/>
)))

const SecureRoute = inject("authStore", "accountStore")(observer(({authStore, accountStore, component: Component, ...rest}) => (
    <Route {...rest} render={(props) => {
        // Special case for onboarding - it has its own layout
        if (rest.path === '/onboarding') {
            return (authStore.isLoggedIn
                ? <Component {...rest} />
                : <Redirect to='/createAccount'/>)
        }

        if (accountStore.user && !accountStore.user.onboardingCompleted) {
            return <Redirect to='/onboarding'/>
        }

        return (authStore.isLoggedIn
            ? <AppLayout><Component {...rest} /></AppLayout>
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
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
                    <Switch location={router.location}>
                        <HomeRoute path="/" exact={true} component={Home}/>
                        <SecureRoute path="/connections" exact={true} component={Connections}/>
                        <SecureRoute path="/onboarding" exact={true} component={Onboarding}/>
                        <SecureRoute path="/account" exact={true} component={Account}/>
                        <SecureRoute path="/account/permissions" exact={true} component={PermissionGroups}/>
                        <SecureRoute path="/account/blocked-users" exact={true} component={BlockedUsers}/>
                        <SecureRoute path="/connections/new" exact={true} component={UserTable}/>
                        <SecureRoute path="/connections/groups" exact={true} component={ConnectionGroups}/>
                        <SecureRoute path="/connections/groups/:groupId" exact={true} component={ConnectionGroup}/>
                        <SecureRoute path="/connections/:userId" exact={true} component={Connection}/>
                        <InsecureRoute path="/createAccount" component={CreateAccount}/>
                        <InsecureRoute path="/confirmAccount" component={ConfirmAccount}/>
                        <InsecureRoute path="/login" component={Login}/>
                        <InsecureRoute path="/forgotPassword" component={ForgotPassword}/>
                        <SharedRoute path="/help" component={Help}/>
                    </Switch>
                </Box>
            </ThemeProvider>
        )
    }
}

export default observer(App);