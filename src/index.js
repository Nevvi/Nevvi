import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import * as serviceWorker from './serviceWorker';

import App from './App';
import {ToastContainer} from "react-toastify";
import NavigationBar from "./components/navbar/Navbar";
import {router} from "./router";

import {Router} from "react-router-dom";
import {Provider} from "mobx-react";
import {Grid} from "@mui/material";

// Stores
import AuthStore from "./stores/AuthStore";
import AccountStore from "./stores/AccountStore";
import LoginStore from "./stores/LoginStore";
import CreateAccountStore from "./stores/CreateAccountStore";
import ConfirmAccountStore from "./stores/ConfirmAccountStore";
import ConfirmAttributeStore from "./stores/ConfirmAttributeStore";
import UsersStore from "./stores/UsersStore";
import ConnectionsStore from "./stores/ConnectionsStore";

const authStore = new AuthStore();
const accountStore = new AccountStore(authStore);
const confirmAttributeStore = new ConfirmAttributeStore(accountStore);
const loginStore = new LoginStore(authStore);
const confirmAccountStore = new ConfirmAccountStore();
const createAccountStore = new CreateAccountStore(authStore, confirmAccountStore);
const connectionsStore = new ConnectionsStore(authStore);
const usersStore = new UsersStore(authStore);

const stores = {
    authStore: authStore,
    accountStore: accountStore,
    loginStore: loginStore,
    createAccountStore: createAccountStore,
    confirmAccountStore: confirmAccountStore,
    confirmAttributeStore: confirmAttributeStore,
    usersStore: usersStore,
    connectionsStore: connectionsStore
}

ReactDOM.render(
    <React.StrictMode>
        <Provider {...stores}>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false}/>
            <NavigationBar/>
            <Grid container rowSpacing={2} className="app-container">
                <Router history={router.history}>
                    <App authStore={authStore}/>
                </Router>
            </Grid>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
