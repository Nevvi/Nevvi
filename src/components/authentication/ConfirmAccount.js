import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {TextField, Grid, Box, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";

class ConfirmAccount extends Component {
    render() {
        const {confirmAccountStore} = this.props
        const isDisabled = confirmAccountStore.email === '' || confirmAccountStore.confirmationCode === ''

        return (
            <Grid container rowSpacing={1}>
                <Typography variant={"h6"}>{confirmAccountStore.confirmationCodePrompt}</Typography>
                <Grid item xs={12}>
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        variant="standard"
                        value={confirmAccountStore.email}
                        onChange={(e) => confirmAccountStore.setEmail(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Confirmation Code"
                        fullWidth
                        variant="standard"
                        value={confirmAccountStore.confirmationCode}
                        onChange={(e) => confirmAccountStore.setConfirmationCode(e.target.value)}
                    />
                </Grid>
                <Box mt={2}>
                    <LoadingButton
                        size={"small"}
                        variant="contained"
                        color="primary"
                        loading={confirmAccountStore.loading}
                        disabled={isDisabled}
                        onClick={async () => await confirmAccountStore.confirmAccount()}
                    >
                        Confirm Account
                    </LoadingButton>
                </Box>
            </Grid>
        );
    }
}

export default inject('confirmAccountStore')(observer(ConfirmAccount));