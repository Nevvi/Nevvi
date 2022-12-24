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

export const theme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#2779A7',
            light: '#5293B8',
            dark: '#1B5474',
            contrastText: '#fff'
        },
        secondary: {
            main: '#49C5B6',
            light: '#6DD0C4',
            dark: '#33897F',
            contrastText: 'rgba(0, 0, 0, 0.87)'
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
