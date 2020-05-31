import React, {Component} from 'react';
import logo from '../logo.svg';
import {login} from './Utils'
import history from '../History'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};

        this.handleChange = this.handleChange.bind(this);
        this.loginAccount = this.loginAccount.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async loginAccount(event) {
        event.preventDefault()
        try {
            await login(this.state.username, this.state.password)
            history.push('/')
        } catch (e) {
            alert(e)
            this.setState({username: '', password: ''})
        }
    }

    render() {
        const isDisabled = this.state.username === '' || this.state.password === ''
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Welcome to Nevvi - {process.env.REACT_APP_ENVIRONMENT}!
                    </p>

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

export default Login;