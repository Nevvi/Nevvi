import React, {Component} from 'react';
import {getUser, updateUser} from '../../utils/ApiUtils'
import Loading from "../loading/Loading";
import {Button, Col, Form} from "react-bootstrap";

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {user: null, updateUser: null, loading: undefined, done: undefined}

        this.handleChange = this.handleChange.bind(this);
        this.updateAccount = this.updateAccount.bind(this);
    }

    componentDidMount() {
        const userId = this.props.userId

        this.setState({loading: true})
        getUser(userId)
            .then(res => {
                const userCopy = JSON.parse(JSON.stringify(res))
                this.setState({user: res, updateUser: userCopy, loading: undefined, done: undefined})
            })
            .catch(err => {
                alert(err)
                this.setState({loading: undefined, done: undefined})
            })
    }

    handleChange(event) {
        const user = this.state.updateUser
        user[event.target.name] = event.target.value
        this.setState({updateUser: user});
    }

    async updateAccount(event) {
        event.preventDefault()
        const updates = {}
        Object.keys(this.state.updateUser).forEach(key => {
            if (JSON.stringify(this.state.user[key]) !== JSON.stringify(this.state.updateUser[key])) {
                updates[key] = this.state.updateUser[key]
            }
        })

        this.setState({loading: true})
        updateUser(this.props.userId, updates)
            .then(res => {
                const userCopy = JSON.parse(JSON.stringify(res))
                this.setState({user: res, updateUser: userCopy, loading: undefined, done: undefined})
            })
            .catch(err => {
                alert(err)
                this.setState({loading: undefined, done: undefined})
            })
    }

    render() {
        // Initial page load
        if (!this.state.user) {
            return <Loading
                component={<div/>}
                loading={this.state.loading}
                done={this.state.done}
            />
        }

        // Subsequent page load
        const isDisabled = JSON.stringify(this.state.user) === JSON.stringify(this.state.updateUser)
        return (
            <Col md={{ span: 4 }}>
                <Form>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Username" name="username" value={this.state.user.username} readOnly/>
                    </Form.Group>
                    <Form.Group controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="First Name" name="firstName" onChange={this.handleChange} value={this.state.updateUser.firstName}/>
                    </Form.Group>
                    <Form.Group controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Last Name" name="lastName" onChange={this.handleChange} value={this.state.updateUser.lastName}/>
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