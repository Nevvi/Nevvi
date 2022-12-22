import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import * as serviceWorker from './serviceWorker';

import App from './App';
import {ToastContainer} from "react-toastify";
import {router} from "./router";

import {Router} from "react-router-dom";
import {Provider} from "mobx-react";

// Stores
import AuthStore from "./stores/AuthStore";
import AccountStore from "./stores/AccountStore";
import LoginStore from "./stores/LoginStore";
import CreateAccountStore from "./stores/CreateAccountStore";
import ConfirmAccountStore from "./stores/ConfirmAccountStore";
import ConfirmAttributeStore from "./stores/ConfirmAttributeStore";
import UsersStore from "./stores/UsersStore";
import ConnectionsStore from "./stores/ConnectionsStore";
import CreatePermissionGroupStore from "./stores/CreatePermissionGroupStore";
import {ProSidebarProvider} from "react-pro-sidebar";
import PermissionGroupModalStore from "./stores/PermissionGroupModalStore";

const authStore = new AuthStore();
const accountStore = new AccountStore(authStore);
const confirmAttributeStore = new ConfirmAttributeStore(accountStore);
const loginStore = new LoginStore(authStore);
const confirmAccountStore = new ConfirmAccountStore();
const createAccountStore = new CreateAccountStore(authStore, confirmAccountStore);
const createPermissionGroupStore = new CreatePermissionGroupStore(authStore, accountStore);
const connectionsStore = new ConnectionsStore(authStore);
const usersStore = new UsersStore(authStore);
const permissionGroupModalStore = new PermissionGroupModalStore(authStore);

const stores = {
    authStore: authStore,
    accountStore: accountStore,
    loginStore: loginStore,
    createAccountStore: createAccountStore,
    confirmAccountStore: confirmAccountStore,
    confirmAttributeStore: confirmAttributeStore,
    usersStore: usersStore,
    connectionsStore: connectionsStore,
    createPermissionGroupStore: createPermissionGroupStore,
    permissionGroupModalStore: permissionGroupModalStore
}

ReactDOM.render(
    <React.StrictMode>
        <Provider {...stores}>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false}/>
            <ProSidebarProvider>
                <Router history={router.history}>
                    <App authStore={authStore}/>
                </Router>
            </ProSidebarProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
