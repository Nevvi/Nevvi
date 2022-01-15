import React, {Component} from 'react';
import {Box, Grid, TextField} from "@mui/material";
import {inject, observer} from "mobx-react";
import {LoadingButton} from "@mui/lab";

class Login extends Component {
    constructor(props) {
        super(props);
        this.loginAccount = this.loginAccount.bind(this);
    }

    async loginAccount(event) {
        event.preventDefault()
        const {loginStore} = this.props;
        await loginStore.login()
    }

    render() {
        const {loginStore} = this.props;
        const isDisabled = loginStore.username === '' || loginStore.password === ''
        return (
            <Grid container rowSpacing={1}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="standard"
                        id="username-input"
                        label="Email"
                        type="text"
                        value={loginStore.username}
                        onChange={(e) => loginStore.setUsername(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="standard"
                        id="password-input"
                        label="Password"
                        type="password"
                        value={loginStore.password}
                        onChange={(e) => loginStore.setPassword(e.target.value)}
                    />
                </Grid>
                <Box mt={2}>
                    <LoadingButton
                        size={"small"}
                        variant="contained"
                        color="primary"
                        loading={loginStore.loading}
                        disabled={isDisabled}
                        onClick={this.loginAccount}>
                        Login
                    </LoadingButton>
                </Box>
            </Grid>
        );
    }
}

export default inject('loginStore')(observer(Login));