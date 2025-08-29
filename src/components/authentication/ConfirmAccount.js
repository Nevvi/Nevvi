import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {Alert, Box, InputAdornment, Stack, TextField, Typography,} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {Phone, Security} from "@mui/icons-material";
import {AppStoreButton} from "./AppStoreButton";
import AuthLayout from "./AuthLayout";

class ConfirmAccount extends Component {
    render() {
        const {confirmAccountStore} = this.props;
        const isDisabled = confirmAccountStore.username === '' || confirmAccountStore.confirmationCode === ''

        return (
            <AuthLayout>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Verify Your Phone
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {confirmAccountStore.confirmationCodePrompt ||
                            "Enter the 6-digit code we sent to your phone number"}
                    </Typography>
                </Box>

                {Object.keys(confirmAccountStore.errors).length > 0 && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Please check the form for errors
                    </Alert>
                )}

                <Stack spacing={3}>
                    <TextField
                        required
                        fullWidth
                        id="username"
                        label="Phone Number"
                        name="username"
                        autoComplete="tel"
                        value={confirmAccountStore.username}
                        onChange={(e) => confirmAccountStore.setUsername(e.target.value)}
                        error={!!confirmAccountStore.errors.username}
                        helperText={confirmAccountStore.errors.username}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Phone color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        required
                        fullWidth
                        name="confirmation"
                        label="Confirmation Code"
                        type="text"
                        id="confirmation"
                        autoComplete="one-time-code"
                        inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' } }}
                        value={confirmAccountStore.confirmationCode}
                        onChange={(e) => confirmAccountStore.setConfirmationCode(e.target.value)}
                        error={!!confirmAccountStore.errors.confirmationCode}
                        helperText={confirmAccountStore.errors.confirmationCode || "Enter the 6-digit code from your SMS"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Security color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <LoadingButton
                        fullWidth
                        size="large"
                        variant="contained"
                        loading={confirmAccountStore.loading}
                        disabled={isDisabled}
                        onClick={async () => await confirmAccountStore.confirmAccount()}
                        sx={{ py: 1.5, fontSize: '1.1rem' }}
                    >
                        {confirmAccountStore.loading ? 'Verifying...' : 'Verify Phone Number'}
                    </LoadingButton>
                </Stack>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Didn't receive a code? Check your spam folder or try again in a few minutes.
                    </Typography>
                    <AppStoreButton
                        url="https://apps.apple.com/us/app/nevvi/id1669915435"
                        style={{ margin: '0 auto' }}
                    />
                </Box>
            </AuthLayout>
        );
    }
}

export default inject('confirmAccountStore')(observer(ConfirmAccount));