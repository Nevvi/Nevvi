import React, {Component} from 'react';
import {Col, Form} from "react-bootstrap";
import Loading from "../loading/Loading";
import {inject, observer} from "mobx-react";
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.createAccount = this.createAccount.bind(this);
    }

    async createAccount(event) {
        event.preventDefault()
        const {createAccountStore} = this.props
        await createAccountStore.createAccount()
    }

    render() {
        const {createAccountStore} = this.props
        const isDisabled = createAccountStore.email === '' || createAccountStore.password === ''

        return (
            <Col md={{ span: 2 }}>
                <Form>
                    <Form.Group controlId="newAccountEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Enter email"
                                      onChange={(e) => createAccountStore.setEmail(e.target.value)}
                                      value={createAccountStore.email}/>
                    </Form.Group>
                    <Form.Group controlId="newAccountPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"
                                      placeholder="Password"
                                      onChange={(e) => createAccountStore.setPassword(e.target.value)}
                                      value={createAccountStore.password}/>
                    </Form.Group>
                    <Loading
                        component={<Button variant="contained" type="submit" disabled={isDisabled} onClick={this.createAccount}>Create Account</Button>}
                        loading={createAccountStore.loading}
                    />
                </Form>
                <Dialog open={createAccountStore.waitingConfirmationCode}>
                    <DialogTitle>Confirm Account</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You're account has been created! We have sent a confirmation code to
                            {createAccountStore.confirmationCodeDestination} which you can use to
                            finish setting up your account.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Confirmation Code"
                            fullWidth
                            variant="standard"
                            value={createAccountStore.confirmationCode}
                            onChange={(e) => createAccountStore.setConfirmationCode(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => createAccountStore.confirmAccount()}>Confirm</Button>
                    </DialogActions>
                </Dialog>
            </Col>
        );
    }
}

export default inject('createAccountStore')(observer(CreateAccount));