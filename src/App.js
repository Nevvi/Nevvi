import React, {Component} from 'react';

// UIs
import Home from './components/home/Home.js';
import Account from './components/account/Account.js';
import Payment from './components/payment/Payment.js';

// Auth
import CreateAccount from './components/authentication/CreateAccount.js';
import Login from './components/authentication/Login.js';

import {
    Switch,
    Route,
    Redirect,
    Router
} from "react-router-dom";

import { ToastContainer } from 'react-toastify';

import NavigationBar from "./components/navbar/Navbar";
import {Container, Row} from "react-bootstrap";
import {inject, observer, Provider} from "mobx-react";

import AuthStore from "./stores/AuthStore";
import {createBrowserHistory} from "history";
import {RouterStore, syncHistoryWithStore} from "mobx-react-router";
import AccountStore from "./stores/AccountStore";
import LoginStore from "./stores/LoginStore";
import CreateAccountStore from "./stores/CreateAccountStore";
import PaymentStore from "./stores/PaymentStore";

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const authStore = new AuthStore();
const paymentStore = new PaymentStore();
const accountStore = new AccountStore();
const loginStore = new LoginStore(routingStore, authStore);
const createAccountStore = new CreateAccountStore(routingStore, authStore);

const stores = {
    routingStore: routingStore,
    authStore: authStore,
    paymentStore: paymentStore,
    accountStore: accountStore,
    loginStore: loginStore,
    createAccountStore: createAccountStore
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
                <Container fluid className="app-container">
                    <Row noGutters className="justify-content-center">
                        <Router history={history}>
                            <Switch>
                                <Route exact path="/"> <Home/> </Route>
                                <SecureRoute path="/account" component={Account}/>
                                <SecureRoute path="/payment" component={Payment}/>
                                <InsecureRoute path="/createAccount" component={CreateAccount}/>
                                <InsecureRoute path="/login" component={Login}/>
                            </Switch>
                        </Router>
                    </Row>
                </Container>
            </Provider>
        )
    }
}

export default App;