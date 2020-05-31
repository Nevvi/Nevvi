import React, {Component} from 'react';
import logo from './logo.svg';
import * as jwt from 'jsonwebtoken';
import './Home.css';
import history from './History';
import axios from 'axios';
import {setTokenHeaders, clearTokenHeaders} from "./authentication/Utils";

class Home extends Component {
    constructor(props) {
        super(props);
        const authentication = localStorage.getItem('Authentication')
        this.state = {authentication: authentication ? JSON.parse(authentication) : null}

        this.logoutAccount = this.logoutAccount.bind(this);
    }

    componentDidMount() {
        const authentication = this.state.authentication
        if (authentication) {
            setTokenHeaders(authentication.IdToken, authentication.AccessToken)
        }
    }

    async logout() {
        // Remove globally
        try {
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/tyler-authentication/v1/logout`
            )
        } catch (e) {
            console.log(`ERROR: Failed to log out`, e)
        }

        // Remove locally
        localStorage.removeItem('Authentication')
        this.setState({authentication: undefined})
        clearTokenHeaders()
    }

    async logoutAccount(event) {
        event.preventDefault()
        await this.logout()
    }

    render() {
        const isLoggedIn = this.state.authentication !== undefined && this.state.authentication !== null
        if (isLoggedIn) {
            const parsed = jwt.decode(this.state.authentication.IdToken)
            const username = parsed ? parsed['cognito:username'] : ''
            return (
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <p>
                            Welcome to Nevvi {username}- {process.env.REACT_APP_ENVIRONMENT}!
                        </p>
                        <button onClick={this.logoutAccount}>Logout</button>
                    </header>
                </div>
            )
        } else {
            return (
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <p>
                            Welcome to Nevvi - {process.env.REACT_APP_ENVIRONMENT}!
                        </p>
                        <button onClick={(event) => {history.push('/createAccount')}}>Create Account</button>
                        <br/>
                        <button onClick={() => {history.push('/login')}}>Login</button>
                    </header>
                </div>
            );
        }
    }
}

export default Home;