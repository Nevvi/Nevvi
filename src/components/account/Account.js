import React, {Component} from 'react';
import './Account.css';
import {getUser} from '../../utils/ApiUtils'
import Loading from "../loading/Loading";
import {Button, Col, Form} from "react-bootstrap";

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {user: null, loading: undefined, done: undefined}
        this.updateAccount = this.updateAccount.bind(this);
    }

    componentDidMount() {
        const userId = this.props.userId

        this.setState({loading: true})
        getUser(userId)
            .then(res => {
                this.setState({user: res, loading: undefined, done: undefined})
            })
            .catch(err => {
                console.log("ERROR", err)
                this.setState({loading: undefined, done: undefined})
            })
    }

    async updateAccount(event) {
        event.preventDefault()
    }

    render() {
        if (!this.state.user) {
            return <Loading
                component={<div/>}
                loading={this.state.loading}
                done={this.state.done}
            />
        }

        const isDisabled = true

        return (
            <Col md={{ span: 4 }}>
                <Form>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Username" name="username" value={this.state.user.username} readOnly/>
                    </Form.Group>
                    <Form.Group controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="First Name" name="firstName" value={this.state.user.firstName} readOnly/>
                    </Form.Group>
                    <Form.Group controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Last Name" name="lastName" value={this.state.user.lastName} readOnly/>
                    </Form.Group>
                    <Loading
                        component={<Button variant="primary" type="submit" disabled={isDisabled} onClick={this.updateAccount}>Update</Button>}
                        loading={this.state.loading}
                        done={this.state.done}
                    />
                </Form>
            </Col>
        )
    }
}

export default Account;