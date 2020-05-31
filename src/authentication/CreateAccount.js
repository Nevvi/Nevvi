import React, {Component} from 'react';
import logo from '../logo.svg';
import axios from 'axios';
import {login} from "./Utils";
import history from '../History'

class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};

        this.handleChange = this.handleChange.bind(this);
        this.createAccount = this.createAccount.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async registerAccount(username, password) {
        try {
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/tyler-authentication/v1/register`,
                {username, password}
            )
            const authentication = await login(username, password)
            localStorage.setItem('Authentication', JSON.stringify(authentication))
            history.push('/')
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            alert(message)
            this.setState({username: '', password: ''})
        }
    }

    async createAccount(event) {
        event.preventDefault()
        await this.registerAccount(this.state.username, this.state.password)
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
                </header>
            </div>
        );
    }
}

export default CreateAccount;