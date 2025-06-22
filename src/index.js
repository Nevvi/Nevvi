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
import {createTheme, ThemeProvider} from "@mui/material";
import ConnectionStore from "./stores/ConnectionStore";
import InviteFormStore from "./stores/InviteFormStore";

const accountStore = new AccountStore();
const authStore = new AuthStore(accountStore);
const connectionStore = new ConnectionStore(authStore, accountStore);
const confirmAttributeStore = new ConfirmAttributeStore(accountStore);
const loginStore = new LoginStore(authStore);
const inviteFormStore = new InviteFormStore(loginStore);
const confirmAccountStore = new ConfirmAccountStore();
const createAccountStore = new CreateAccountStore(authStore, confirmAccountStore);
const createPermissionGroupStore = new CreatePermissionGroupStore(authStore, accountStore);
const connectionsStore = new ConnectionsStore(authStore, accountStore);
const usersStore = new UsersStore(authStore);
const permissionGroupModalStore = new PermissionGroupModalStore(authStore);

const stores = {
    authStore: authStore,
    accountStore: accountStore,
    inviteFormStore: inviteFormStore,
    connectionStore: connectionStore,
    loginStore: loginStore,
    createAccountStore: createAccountStore,
    confirmAccountStore: confirmAccountStore,
    confirmAttributeStore: confirmAttributeStore,
    usersStore: usersStore,
    connectionsStore: connectionsStore,
    createPermissionGroupStore: createPermissionGroupStore,
    permissionGroupModalStore: permissionGroupModalStore
}

export const theme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#0098ff',
            light: '#0098ff',
            dark: '#162d50',
            contrastText: '#fff'
        },
        background: {
            default: '#f7f9fb',
            paper: '#fff'
        },
        error: {
            main: '#DF6C4F',
            light: '#E58972',
            dark: '#9C4B37',
            contrastText: '#fff'
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <Provider {...stores}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={theme}>
                    <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false}/>
                    <ProSidebarProvider>
                        <Router history={router.history}>
                            <App authStore={authStore}/>
                        </Router>
                    </ProSidebarProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
