import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Box, Button, Divider, InputAdornment, Stack, TextField, Typography} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {ArrowBack, Lock, Phone, Security} from '@mui/icons-material';
import AuthLayout from './AuthLayout';
import {router} from '../../router';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 'username' // 'username' or 'confirmation'
        };
    }

    handleSendCode = async (event) => {
        event.preventDefault();
        const {forgotPasswordStore} = this.props;

        await forgotPasswordStore.sendForgotPasswordCode();

        // If successful (no errors thrown), move to confirmation step
        this.setState({step: 'confirmation'});
    }

    handleConfirmCode = async (event) => {
        event.preventDefault();
        const {forgotPasswordStore} = this.props;

        await forgotPasswordStore.confirmForgotPasswordCode();
        // The store handles navigation to login page on success
    }

    renderUsernameStep() {
        const {forgotPasswordStore} = this.props;
        const isDisabled = forgotPasswordStore.username === '';

        return (
            <>
                <Box sx={{textAlign: 'center', mb: 4}}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Reset Password
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Enter your phone number to receive a password reset code
                    </Typography>
                </Box>

                <form onSubmit={this.handleSendCode}>
                    <Stack spacing={3}>
                        <TextField
                            required
                            fullWidth
                            id="username"
                            label="Phone Number"
                            name="username"
                            autoComplete="tel"
                            autoFocus
                            placeholder="+1 (555) 123-4567"
                            value={forgotPasswordStore.username}
                            onChange={(e) => forgotPasswordStore.setUsername(e.target.value)}
                            error={!!forgotPasswordStore.errors?.username}
                            helperText={forgotPasswordStore.errors?.username}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone color="action"/>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <LoadingButton
                            type="submit"
                            fullWidth
                            size="large"
                            variant="contained"
                            loading={forgotPasswordStore.loading}
                            disabled={isDisabled}
                            sx={{py: 1.5, fontSize: '1.1rem'}}
                        >
                            {forgotPasswordStore.loading ? 'Sending Code...' : 'Send Reset Code'}
                        </LoadingButton>

                        <Divider sx={{my: 2}}/>

                        <Button
                            fullWidth
                            variant="text"
                            startIcon={<ArrowBack/>}
                            onClick={() => router.push('/login')}
                            sx={{py: 1.5, fontSize: '1.1rem'}}
                        >
                            Back to Sign In
                        </Button>
                    </Stack>
                </form>
            </>
        );
    }

    renderConfirmationStep() {
        const {forgotPasswordStore} = this.props;
        const isDisabled = forgotPasswordStore.confirmationCode === '' ||
            forgotPasswordStore.newPassword === '';

        return (
            <>
                <Box sx={{textAlign: 'center', mb: 4}}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Enter Reset Code
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {forgotPasswordStore.confirmationCodePrompt}
                    </Typography>
                </Box>

                <form onSubmit={this.handleConfirmCode}>
                    <Stack spacing={3}>
                        <TextField
                            required
                            fullWidth
                            id="confirmationCode"
                            label="Confirmation Code"
                            name="confirmationCode"
                            autoFocus
                            placeholder="123456"
                            value={forgotPasswordStore.confirmationCode}
                            onChange={(e) => forgotPasswordStore.setConfirmationCode(e.target.value)}
                            error={!!forgotPasswordStore.errors?.confirmationCode}
                            helperText={forgotPasswordStore.errors?.confirmationCode}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Security color="action"/>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            required
                            fullWidth
                            name="newPassword"
                            label="New Password"
                            type="password"
                            id="newPassword"
                            autoComplete="new-password"
                            value={forgotPasswordStore.newPassword}
                            onChange={(e) => forgotPasswordStore.setPassword(e.target.value)}
                            error={!!forgotPasswordStore.errors?.newPassword}
                            helperText={forgotPasswordStore.errors?.newPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action"/>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <LoadingButton
                            type="submit"
                            fullWidth
                            size="large"
                            variant="contained"
                            loading={forgotPasswordStore.loading}
                            disabled={isDisabled}
                            sx={{py: 1.5, fontSize: '1.1rem'}}
                        >
                            {forgotPasswordStore.loading ? 'Resetting Password...' : 'Reset Password'}
                        </LoadingButton>

                        <Divider sx={{my: 2}}/>

                        <Stack direction="row" spacing={2}>
                            <Button
                                fullWidth
                                variant="text"
                                onClick={() => this.setState({step: 'username'})}
                                sx={{py: 1.5, fontSize: '1.1rem'}}
                            >
                                Change Phone Number
                            </Button>

                            <Button
                                fullWidth
                                variant="text"
                                onClick={() => router.push('/login')}
                                sx={{py: 1.5, fontSize: '1.1rem'}}
                            >
                                Back to Sign In
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </>
        );
    }

    render() {
        return (
            <AuthLayout>
                {this.state.step === 'username' ? this.renderUsernameStep() : this.renderConfirmationStep()}
            </AuthLayout>
        );
    }
}

export default inject('forgotPasswordStore')(observer(ForgotPassword));