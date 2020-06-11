import React, {Component} from 'react';
import './Home.css';
import {Button} from "react-bootstrap";
import history from '../History'

class Home extends Component {
    render() {
        if (this.props.loggedIn) {
            return <div>Hello!</div>
        }

        return <Button variant="primary" onClick={() => {history.push('/createAccount')}}>Create Account</Button>
    }
}

export default Home;