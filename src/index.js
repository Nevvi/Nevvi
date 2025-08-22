
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

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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
import ConnectionStore from "./stores/ConnectionStore";
import ConnectionGroupsStore from "./stores/ConnectionGroupsStore";

const accountStore = new AccountStore();
const authStore = new AuthStore(accountStore);
const connectionStore = new ConnectionStore(authStore, accountStore);
const confirmAttributeStore = new ConfirmAttributeStore(accountStore);
const loginStore = new LoginStore(authStore);
const confirmAccountStore = new ConfirmAccountStore();
const createAccountStore = new CreateAccountStore(authStore, confirmAccountStore);
const createPermissionGroupStore = new CreatePermissionGroupStore(authStore, accountStore);
const connectionsStore = new ConnectionsStore(authStore, accountStore);
const usersStore = new UsersStore(authStore);
const permissionGroupModalStore = new PermissionGroupModalStore(authStore);
const connectionGroupsStore = new ConnectionGroupsStore(authStore);

const stores = {
    authStore: authStore,
    accountStore: accountStore,
    connectionStore: connectionStore,
    loginStore: loginStore,
    createAccountStore: createAccountStore,
    confirmAccountStore: confirmAccountStore,
    confirmAttributeStore: confirmAttributeStore,
    usersStore: usersStore,
    connectionsStore: connectionsStore,
    createPermissionGroupStore: createPermissionGroupStore,
    permissionGroupModalStore: permissionGroupModalStore,
    connectionGroupsStore: connectionGroupsStore
}

ReactDOM.render(
    <React.StrictMode>
        <Provider {...stores}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <ProSidebarProvider>
                    <Router history={router.history}>
                        <App authStore={authStore}/>
                    </Router>
                </ProSidebarProvider>
            </LocalizationProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();