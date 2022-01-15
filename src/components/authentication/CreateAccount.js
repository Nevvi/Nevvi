import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import { Button, TextField, Grid, Box} from "@mui/material";
import {LoadingButton} from "@mui/lab";

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
        const {createAccountStore, routingStore} = this.props
        const isDisabled = createAccountStore.email === '' || createAccountStore.password === ''

        return (
            <Grid container rowSpacing={1}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="standard"
                        id="username-input"
                        label="Email"
                        type="text"
                        value={createAccountStore.email}
                        onChange={(e) => createAccountStore.setEmail(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="standard"
                        id="password-input"
                        label="Password"
                        type="password"
                        value={createAccountStore.password}
                        onChange={(e) => createAccountStore.setPassword(e.target.value)}
                    />
                </Grid>
                <Box mt={2}>
                    <LoadingButton
                        size={"small"}
                        variant="contained"
                        color="primary"
                        loading={createAccountStore.loading}
                        disabled={isDisabled}
                        onClick={this.createAccount}
                    >
                        Create Account
                    </LoadingButton>
                </Box>
                <Box mt={2} ml={1}>
                    <Button
                        size={"small"}
                        variant="outlined"
                        color="primary"
                        onClick={() => routingStore.push('/confirmAccount')}
                    >
                        Confirm Account
                    </Button>
                </Box>
            </Grid>
        );
    }
}

export default inject('createAccountStore', 'routingStore')(observer(CreateAccount));