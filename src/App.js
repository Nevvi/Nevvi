import React, {Component} from 'react';
import history from './History'
import Home from './Home.js';

// auth
import CreateAccount from './authentication/CreateAccount.js';
import Login from './authentication/Login.js';

import {
    Router,
    Switch,
    Route,
    Link
} from "react-router-dom";


class App extends Component {
    render() {
        return (
            <Router history={history}>
                <div>
                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/createAccount">
                            <CreateAccount />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;