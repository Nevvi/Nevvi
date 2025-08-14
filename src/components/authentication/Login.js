import React, {Component} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    IconButton, InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import {inject, observer} from "mobx-react";
import {LoadingButton} from "@mui/lab";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Logo from "../utils/Logo";
import {router} from "../../router";
import {AppStoreButton} from "./AppStoreButton";

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
            <Container component="main" maxWidth="sm">
                <Box
                    sx={{
                        minHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 3
                    }}
                >
                    <Card
                        sx={{
                            width: '100%',
                            maxWidth: 450,
                            boxShadow: 1,
                            borderRadius: 2
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    mb: 3
                                }}
                            >
                                <Logo />

                                <Typography
                                    component="h1"
                                    variant={'h4'}
                                    fontWeight="bold"
                                    color="text.primary"
                                >
                                    Sign In
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    textAlign="center"
                                    sx={{ mt: 1 }}
                                >
                                    Enter your credentials to access your account
                                </Typography>
                            </Box>

                            <Box textAlign={"center"}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Phone Number"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    value={loginStore.username}
                                    onChange={(e) => loginStore.setUsername(e.target.value)}
                                    error={!!loginStore.errors.username}
                                    helperText={loginStore.errors.username}
                                    sx={{ mb: 2 }}
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
                                    error={!!loginStore.errors.password}
                                    helperText={loginStore.errors.password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={(e) => loginStore.toggleShowPassword()}
                                                    edge="end"
                                                >
                                                    {loginStore.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />

                                <LoadingButton
                                    size={"medium"}
                                    variant="contained"
                                    color="primary"
                                    loading={loginStore.loading}
                                    disabled={isDisabled}
                                    onClick={this.loginAccount}>
                                    Login
                                </LoadingButton>

                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Need to confirm an account?{' '}
                                        <Button
                                            variant="text"
                                            size="small"
                                            sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                                            onClick={() => router.push("/confirmAccount")}
                                        >
                                            Confirm
                                        </Button>
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    <AppStoreButton url="https://apps.apple.com/us/app/nevvi/id1669915435" style={{marginTop: "2rem"}}/>
                </Box>
            </Container>
        );
    }
}

export default inject('loginStore')(observer(Login));