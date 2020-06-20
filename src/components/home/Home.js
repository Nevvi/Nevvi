import React, {Component} from 'react';
import './Home.css';
import {Button} from "react-bootstrap";
import history from '../../History'
import {getUser} from '../../utils/ApiUtils'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {user: null}
    }

    componentDidMount() {
        if (this.props.loggedIn) {
            const userId = this.props.userId

            getUser(userId)
                .then(res => {
                    this.setState({user: res})
                })
                .catch(err => {
                    console.log("ERROR", err)
                })
        }
    }

    render() {
        if (this.props.loggedIn && !this.state.user) {
            return <div>
                Hello!
            </div>
        }

        if (this.props.loggedIn && this.state.user) {
            return <div>
                Hello {this.state.user.username}!
            </div>
        }

        return <Button variant="primary" onClick={() => {history.push('/createAccount')}}>Create Account</Button>
    }
}

export default Home;