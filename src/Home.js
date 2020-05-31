import React, {Component} from 'react';
import logo from './logo.svg';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import './Home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        const authentication = localStorage.getItem("Authentication")
        this.state = {username: '', password: '', authentication: authentication ? JSON.parse(authentication) : null};

        this.handleChange = this.handleChange.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.loginAccount = this.loginAccount.bind(this);
        this.logoutAccount = this.logoutAccount.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    registerAccount(username, password) {
        const that = this
        axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/tyler-authentication/v1/register`,
            {username, password}
        ).then(function (response) {
            that.login(username, password)
        }).catch(function (error) {
            if (error.response && error.response.data) alert(JSON.stringify(error.response.data))
            else alert('Signup failed')
        })

        this.setState({username: '', password: ''});
    }

    login(username, password) {
        const that = this
        axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/tyler-authentication/v1/login`,
            {username, password}
        ).then(function (response) {
            localStorage.setItem('Authentication', JSON.stringify(response.data.AuthenticationResult))
            that.setState({authentication: response.data.AuthenticationResult})
        }).catch(function (error) {
            if (error.response && error.response.data) alert(JSON.stringify(error.response.data))
            else alert('Login failed')
        })
    }

    logout() {
        // TODO - call API
        localStorage.removeItem('Authentication')
        this.setState({authentication: undefined})
    }

    createAccount(event) {
        event.preventDefault()
        this.registerAccount(this.state.username, this.state.password)
    }

    loginAccount(event) {
        event.preventDefault()
        this.login(this.state.username, this.state.password)
    }

    logoutAccount(event) {
        event.preventDefault()
        this.logout()
    }

    render() {
        const isDisabled = this.state.username === '' || this.state.password === ''
        const isLoggedIn = this.state.authentication !== undefined && this.state.authentication !== null
        if (isLoggedIn) {
            const parsed = jwt.decode(this.state.authentication.IdToken)
            return (
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <p>
                            Welcome to Nevvi {parsed['cognito:username']} - {process.env.REACT_APP_ENVIRONMENT}!
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

                        <form onSubmit={this.createAccount}>
                            <label>
                                Username:
                                <input name="username" type="text" value={this.state.username}
                                       onChange={this.handleChange}/>
                            </label>
                            <br/>
                            <label>
                                Password:
                                <input name="password" type="password" value={this.state.password}
                                       onChange={this.handleChange}/>
                            </label>
                            <br/>
                            <input type="submit" disabled={isDisabled} value="Create Account"/>
                        </form>
                        <br/>
                        <form onSubmit={this.loginAccount}>
                            <label>
                                Username:
                                <input name="username" type="text" value={this.state.username}
                                       onChange={this.handleChange}/>
                            </label>
                            <br/>
                            <label>
                                Password:
                                <input name="password" type="password" value={this.state.password}
                                       onChange={this.handleChange}/>
                            </label>
                            <br/>
                            <input type="submit" disabled={isDisabled} value="Login"/>
                        </form>
                    </header>
                </div>
            );
        }
    }
}

export default Home;