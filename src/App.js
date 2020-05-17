import React, {Component} from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

class App extends Component {
    componentDidMount() {
        console.log(process.env.REACT_APP_API_BASE_URL)
    }

    createAccount() {
        axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/tyler-authentication/v1/register`,
            {
                username: 'tcobb2',
                password: 'Passw0rd!'
            }
        ).then(function (response) {
            console.log('RESPONSE', response)
        }).catch(function (error) {
            console.log('ERROR', error)
        })
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Welcome to Nevvi - {process.env.REACT_APP_ENVIRONMENT}!
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>

                    <button onClick={this.createAccount}>
                        Create Account
                    </button>
                </header>
            </div>
        );
    }
}

export default App;