import React, {Component} from 'react';

// UIs
import Home from './components/home/Home.js';
import Account from './components/account/Account.js';
import Payment from './components/payment/Payment.js';

// Auth
import CreateAccount from './components/authentication/CreateAccount.js';
import ConfirmAccount from "./components/authentication/ConfirmAccount";
import Login from './components/authentication/Login.js';

import {
    Switch,
    Route,
    Redirect,
    Router
} from "react-router-dom";

import { ToastContainer } from 'react-toastify';

import NavigationBar from "./components/navbar/Navbar";
import {inject, observer, Provider} from "mobx-react";

import AuthStore from "./stores/AuthStore";
import {createBrowserHistory} from "history";
import {RouterStore, syncHistoryWithStore} from "mobx-react-router";
import AccountStore from "./stores/AccountStore";
import LoginStore from "./stores/LoginStore";
import CreateAccountStore from "./stores/CreateAccountStore";
import PaymentStore from "./stores/PaymentStore";
import {Grid} from "@mui/material";
import ConfirmAccountStore from "./stores/ConfirmAccountStore";
import ConfirmAttributeStore from "./stores/ConfirmAttributeStore";
import Groups from "./components/notifications/Groups";
import NotificationGroupsStore from "./stores/NotificationGroupsStore";

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const authStore = new AuthStore();
const paymentStore = new PaymentStore();
const accountStore = new AccountStore();
const confirmAttributeStore = new ConfirmAttributeStore(routingStore, accountStore);
const loginStore = new LoginStore(routingStore, authStore);
const confirmAccountStore = new ConfirmAccountStore(routingStore);
const createAccountStore = new CreateAccountStore(routingStore, authStore, confirmAccountStore);
const notificationGroupsStore = new NotificationGroupsStore();

const stores = {
    routingStore: routingStore,
    authStore: authStore,
    paymentStore: paymentStore,
    accountStore: accountStore,
    loginStore: loginStore,
    createAccountStore: createAccountStore,
    confirmAccountStore: confirmAccountStore,
    confirmAttributeStore: confirmAttributeStore,
    notificationGroupsStore: notificationGroupsStore
}

const history = syncHistoryWithStore(browserHistory, routingStore);

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
        authStore.reload()
    }

    render() {
        return (
            <Provider {...stores}>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false}/>
                <NavigationBar/>
                <Grid container rowSpacing={2} style={{marginTop: "1rem", padding: "0 1rem"}}>
                    <Grid item xs={12} style={{paddingTop: "0.3rem"}}>
                        <Router history={history}>
                            <Switch>
                                <Route exact path="/"> <Home/> </Route>
                                <SecureRoute path="/account" component={Account}/>
                                <SecureRoute path="/groups" component={Groups}/>
                                <SecureRoute path="/payment" component={Payment}/>
                                <InsecureRoute path="/createAccount" component={CreateAccount}/>
                                <InsecureRoute path="/confirmAccount" component={ConfirmAccount}/>
                                <InsecureRoute path="/login" component={Login}/>
                            </Switch>
                        </Router>
                    </Grid>
                </Grid>
            </Provider>
        )
    }
}

export default App;