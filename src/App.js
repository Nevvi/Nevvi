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

import NavigationBar from "./components/navbar/Navbar";
import {Container, Row} from "react-bootstrap";
import {inject, observer, Provider} from "mobx-react";

import AuthStore from "./stores/AuthStore";
import {createBrowserHistory} from "history";
import {RouterStore, syncHistoryWithStore} from "mobx-react-router";

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const authStore = new AuthStore();

const stores = {
    // Key can be whatever you want
    routingStore: routingStore,
    authStore: authStore
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