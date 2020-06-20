import React, {Component} from 'react';
import history from './History'
import Home from './components/home/Home.js';

// auth
import CreateAccount from './components/authentication/CreateAccount.js';
import Login from './components/authentication/Login.js';

import {
    Router,
    Switch,
    Route, Redirect,
} from "react-router-dom";
import {clearTokenHeaders, setTokenHeaders} from "./utils/AuthUtils";
import axios from "axios";
import NavigationBar from "./components/navbar/Navbar";
import {Container, Row} from "react-bootstrap";

const InsecureRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => {
        return (!rest.loggedIn
            ? <Component {...rest} />
            : <Redirect to='/'/>)
    }}/>
)

class App extends Component {
    constructor(props) {
        super(props);

        const authentication = localStorage.getItem('Authentication')
        const userId = localStorage.getItem('UserId')
        this.state = {
            authentication: authentication ? JSON.parse(authentication) : null,
            loggedIn: authentication !== undefined && authentication !== null,
            userId: userId
        }

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        const authentication = this.state.authentication
        if (authentication) {
            setTokenHeaders(authentication.IdToken, authentication.AccessToken)
        }
    }

    async login(username, password) {
        console.log("Logging in!")
        try {
            const response = await axios.post(
                `/api/authentication/v1/login`,
                {username, password}
            )

            // Globally set auth info
            const authentication = response.data.AuthenticationResult
            localStorage.setItem('Authentication', JSON.stringify(authentication))
            setTokenHeaders(authentication.IdToken, authentication.AccessToken)

            // Globally set user id
            const userId = response.data.User.Id
            localStorage.setItem('UserId', userId)

            this.setState({loggedIn: true, authentication: authentication, userId: userId})

            return authentication
        } catch (e) {
            throw new Error(`Login failed because ${e.response.data}`)
        }
    }

    async logout() {
        console.log("Logging out!")

        // Remove locally
        localStorage.removeItem('Authentication')

        // Remove globally
        try {
            await axios.post(
                `/api/authentication/v1/logout`
            )
        } catch (e) {
            console.log(`ERROR: Failed to log out`, e)
        }

        this.setState({authentication: undefined, loggedIn: false, userId: undefined})
        clearTokenHeaders()
    }

    render() {
        return (
            <Router history={history}>
                <div>
                    <NavigationBar loggedIn={this.state.loggedIn} logOut={this.logout}/>
                    <Container fluid className="app-container">
                        <Row noGutters className="justify-content-center">
                            <Switch>
                                <Route exact path="/">
                                    <Home loggedIn={this.state.loggedIn} userId={this.state.userId}/>
                                </Route>
                                <InsecureRoute path="/createAccount" loggedIn={this.state.loggedIn} login={this.login} component={CreateAccount} />
                                <InsecureRoute path="/login" loggedIn={this.state.loggedIn} login={this.login} component={Login}/>
                            </Switch>
                        </Row>
                    </Container>
                </div>
            </Router>
        )
    }
}

export default App;