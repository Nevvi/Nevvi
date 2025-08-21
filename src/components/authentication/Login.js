import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Button,
    TextField,
    Box,
    Typography,
    InputAdornment,
    IconButton,
    Stack,
    Divider,
    Alert,
    Link,
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {router} from '../../router'
import {Visibility, VisibilityOff, Phone, Lock} from "@mui/icons-material";
import {AppStoreButton} from "./AppStoreButton";
import AuthLayout from "./AuthLayout";

class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
    }

    async handleLogin(event) {
        event.preventDefault();
        const {loginStore} = this.props;
        await loginStore.login();
    }

    render() {
        const {loginStore} = this.props;
        const isDisabled = loginStore.username === '' || loginStore.password === '';

        return (
            <AuthLayout>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Sign in to your Nevvi account to manage your connections
                    </Typography>
                </Box>

                {loginStore.errorMessage && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {loginStore.errorMessage}
                    </Alert>
                )}

                <form onSubmit={this.handleLogin}>
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
                            value={loginStore.username}
                            onChange={(e) => loginStore.setUsername(e.target.value)}
                            error={!!loginStore.errors?.username}
                            helperText={loginStore.errors?.username}
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
                            type={loginStore.showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={loginStore.password}
                            onChange={(e) => loginStore.setPassword(e.target.value)}
                            error={!!loginStore.errors?.password}
                            helperText={loginStore.errors?.password}
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
                                            onClick={() => loginStore.toggleShowPassword()}
                                            edge="end"
                                        >
                                            {loginStore.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ textAlign: 'right' }}>
                            <Link
                                component="button"
                                type="button"
                                variant="body2"
                                onClick={() => {
                                    // TODO: Implement forgot password
                                    console.log('Forgot password clicked');
                                }}
                                sx={{
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                Forgot your password?
                            </Link>
                        </Box>

                        <LoadingButton
                            type="submit"
                            fullWidth
                            size="large"
                            variant="contained"
                            loading={loginStore.loading}
                            disabled={isDisabled}
                            sx={{ py: 1.5, fontSize: '1.1rem' }}
                        >
                            {loginStore.loading ? 'Signing In...' : 'Sign In'}
                        </LoadingButton>

                        <Divider sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                New to Nevvi?
                            </Typography>
                        </Divider>

                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            onClick={() => router.push("/createAccount")}
                            sx={{ py: 1.5, fontSize: '1.1rem' }}
                        >
                            Create Free Account
                        </Button>
                    </Stack>
                </form>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <AppStoreButton
                        url="https://apps.apple.com/us/app/nevvi/id1669915435"
                        style={{ margin: '0 auto' }}
                    />
                </Box>
            </AuthLayout>
        );
    }
}

export default inject('loginStore')(observer(Login));