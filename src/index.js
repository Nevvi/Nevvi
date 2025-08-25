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

import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

// Stores
import AuthStore from "./stores/AuthStore";
import AccountStore from "./stores/AccountStore";
import LoginStore from "./stores/LoginStore";
import CreateAccountStore from "./stores/CreateAccountStore";
import ConfirmAccountStore from "./stores/ConfirmAccountStore";
import ConfirmAttributeStore from "./stores/ConfirmAttributeStore";
import UsersStore from "./stores/UsersStore";
import ConnectionsStore from "./stores/ConnectionsStore";
import PermissionGroupStore from "./stores/CreatePermissionGroupStore";
import {ProSidebarProvider} from "react-pro-sidebar";
import PermissionGroupModalStore from "./stores/PermissionGroupModalStore";
import ConnectionStore from "./stores/ConnectionStore";
import ConnectionGroupsStore from "./stores/ConnectionGroupsStore";
import ConnectionGroupStore from "./stores/ConnectionGroupStore";
import ForgotPasswordStore from "./stores/ForgotPasswordStore";
import {createApiClient} from "./stores/BaseStore";

const accountStore = new AccountStore();
const authStore = new AuthStore(accountStore);
const apiClient = createApiClient(authStore);

const connectionStore = new ConnectionStore(authStore, accountStore, apiClient);
const confirmAttributeStore = new ConfirmAttributeStore(accountStore, apiClient);
const loginStore = new LoginStore(authStore, apiClient);
const confirmAccountStore = new ConfirmAccountStore(apiClient);
const forgotPasswordStore = new ForgotPasswordStore(apiClient);
const createAccountStore = new CreateAccountStore(authStore, confirmAccountStore, apiClient);
const permissionGroupStore = new PermissionGroupStore(accountStore, apiClient);
const connectionsStore = new ConnectionsStore(authStore, accountStore, apiClient);
const usersStore = new UsersStore(authStore, apiClient);
const permissionGroupModalStore = new PermissionGroupModalStore(authStore, apiClient);
const connectionGroupsStore = new ConnectionGroupsStore(authStore, apiClient);
const connectionGroupStore = new ConnectionGroupStore(authStore, apiClient);

const stores = {
    authStore: authStore,
    accountStore: accountStore,
    connectionStore: connectionStore,
    loginStore: loginStore,
    createAccountStore: createAccountStore,
    confirmAccountStore: confirmAccountStore,
    forgotPasswordStore: forgotPasswordStore,
    confirmAttributeStore: confirmAttributeStore,
    usersStore: usersStore,
    connectionsStore: connectionsStore,
    permissionGroupStore: permissionGroupStore,
    permissionGroupModalStore: permissionGroupModalStore,
    connectionGroupsStore: connectionGroupsStore,
    connectionGroupStore: connectionGroupStore
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