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

const authStore = new AuthStore();
const accountStore = new AccountStore();
const confirmAttributeStore = new ConfirmAttributeStore(accountStore);
const loginStore = new LoginStore(authStore);
const confirmAccountStore = new ConfirmAccountStore();
const createAccountStore = new CreateAccountStore(authStore, confirmAccountStore);

const stores = {
    authStore: authStore,
    accountStore: accountStore,
    loginStore: loginStore,
    createAccountStore: createAccountStore,
    confirmAccountStore: confirmAccountStore,
    confirmAttributeStore: confirmAttributeStore,
}

ReactDOM.render(
    <React.StrictMode>
        <Provider {...stores}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false}/>
            <NavigationBar/>
            <Grid container rowSpacing={2} style={{marginTop: "1rem", padding: "0 1rem"}}>
                <Grid item xs={12} style={{paddingTop: "0.3rem"}}>
                    <Router history={router.history}>
                        <App authStore={authStore}/>
                    </Router>
                </Grid>
            </Grid>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
