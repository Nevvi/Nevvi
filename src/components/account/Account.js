import React, {Component} from 'react';
import Loading from "../loading/Loading";
import {Button, Col, Form} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";

class Account extends Component {
    constructor(props) {
        super(props);

        this.updateAccount = this.updateAccount.bind(this);
    }

    componentDidMount() {
        const {authStore, accountStore} = this.props;
        accountStore.getUser(authStore.userId)
    }

    async updateAccount(event) {
        event.preventDefault()
        const {accountStore} = this.props;
        await accountStore.saveUser()
    }

    render() {
        // Initial page load
        const {accountStore} = this.props;
        const user = accountStore.user;
        if (!user) {
            return <Loading component={<div/>} loading={accountStore.loading}/>
        }

        // Subsequent page load
        return (
            <Col md={{ span: 4 }}>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label> Email ({user.emailVerified ? 'verified' : 'unverified'}) </Form.Label>
                        <Form.Control disabled={user.emailVerified} type="text" placeholder="Email" value={user.email}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPhone">
                        <Form.Label>
                            Phone Number ({user.phoneNumberVerified ? 'verified' : 'unverified'})
                            {!user.phoneNumberVerified ? <Button onClick={() => accountStore.sendPhoneConfirmCode()}>Verify</Button> : ''}
                        </Form.Label>
                        <Form.Control disabled={user.phoneNumberVerified} type="text" placeholded="+15551234567" value={user.phoneNumber} onChange={(e) => accountStore.updateUser("phoneNumber", e.target.value)}/>
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Name" value={user.name} onChange={(e) => accountStore.updateUser("name", e.target.value)}/>
                    </Form.Group>
                    <Loading
                        component={<Button variant="primary" type="submit" onClick={this.updateAccount}>Update</Button>}
                        loading={accountStore.loading}
                    />
                </Form>
                <Dialog open={accountStore.waitingConfirmationCode}>
                    <DialogTitle>Confirm Phone Number</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{accountStore.confirmationCodePrompt}</DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Confirmation Code"
                            fullWidth
                            variant="standard"
                            value={accountStore.confirmationCode}
                            onChange={(e) => accountStore.setConfirmationCode(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => accountStore.cancelConfirm()}>Cancel</Button>
                        <Button onClick={() => accountStore.confirmPhone()}>Confirm</Button>
                    </DialogActions>
                </Dialog>
            </Col>
        )
    }
}

export default inject("authStore", "accountStore")(observer(Account));