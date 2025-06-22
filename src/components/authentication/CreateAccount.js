import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Button,
    TextField,
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    InputAdornment,
    IconButton
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {router} from '../../router'
import Logo from "../utils/Logo";
import {Visibility, VisibilityOff} from "@mui/icons-material";

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
                                    Sign Up
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    textAlign="center"
                                    sx={{ mt: 1 }}
                                >
                                    Enter your phone number to create your free account
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
                                    value={createAccountStore.username}
                                    onChange={(e) => createAccountStore.setUsername(e.target.value)}
                                    error={!!createAccountStore.errors.username}
                                    helperText={createAccountStore.errors.username}
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={createAccountStore.showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    value={createAccountStore.password}
                                    onChange={(e) => createAccountStore.setPassword(e.target.value)}
                                    error={!!createAccountStore.errors.password}
                                    helperText={createAccountStore.errors.password}
                                    InputProps={{
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
                                    sx={{ mb: 2 }}
                                />

                                <LoadingButton
                                    size={"medium"}
                                    variant="contained"
                                    color="primary"
                                    loading={createAccountStore.loading}
                                    disabled={isDisabled}
                                    onClick={this.createAccount}>
                                    Create Account
                                </LoadingButton>

                                <Box sx={{ textAlign: 'center', mt: 3, mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Already have an account?{' '}
                                        <Button
                                            variant="text"
                                            size="small"
                                            sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                                            onClick={() => router.push("/login")}
                                        >
                                            Login
                                        </Button>
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        );
    }
}

export default inject('createAccountStore')(observer(CreateAccount));