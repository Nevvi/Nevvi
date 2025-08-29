import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {Alert, Box, Button, Divider, IconButton, InputAdornment, Stack, TextField, Typography,} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {router} from '../../router'
import {Lock, Phone, Visibility, VisibilityOff} from "@mui/icons-material";
import {AppStoreButton} from "./AppStoreButton";
import AuthLayout from "./AuthLayout";

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
        const {createAccountStore} = this.props;
        const isDisabled = createAccountStore.username === '' || createAccountStore.password === ''

        return (
            <AuthLayout>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Create Your Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Join Nevvi to stay connected with the people that matter most
                    </Typography>
                </Box>

                {Object.keys(createAccountStore.errors).length > 0 && (
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
                        placeholder="+1 (555) 123-4567"
                        value={createAccountStore.username}
                        onChange={(e) => createAccountStore.setUsername(e.target.value)}
                        error={!!createAccountStore.errors.username}
                        helperText={createAccountStore.errors.username || "We'll send a confirmation code to this number"}
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
                        name="password"
                        label="Password"
                        type={createAccountStore.showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        value={createAccountStore.password}
                        onChange={(e) => createAccountStore.setPassword(e.target.value)}
                        error={!!createAccountStore.errors.password}
                        helperText={createAccountStore.errors.password || "Must contain: uppercase letter, lowercase letter, number, special character, and be at least 8 characters"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={(e) => createAccountStore.toggleShowPassword()}
                                        edge="end"
                                    >
                                        {createAccountStore.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <LoadingButton
                        fullWidth
                        size="large"
                        variant="contained"
                        loading={createAccountStore.loading}
                        disabled={isDisabled}
                        onClick={this.createAccount}
                        sx={{ py: 1.5, fontSize: '1.1rem' }}
                    >
                        {createAccountStore.loading ? 'Creating Account...' : 'Create Account'}
                    </LoadingButton>

                    <Divider sx={{ my: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?
                        </Typography>
                    </Divider>

                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        onClick={() => router.push("/login")}
                        sx={{ py: 1.5, fontSize: '1.1rem' }}
                    >
                        Sign In Instead
                    </Button>
                </Stack>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        By creating an account, you agree to our{' '}
                        <a 
                            href="https://app.termly.io/policy-viewer/policy.html?policyUUID=5dfc4b38-5260-4da5-9f7d-bcff246f6a4e" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: 'inherit', textDecoration: 'underline' }}
                        >
                            Privacy Policy
                        </a>
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

export default inject('createAccountStore')(observer(CreateAccount));