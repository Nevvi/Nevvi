import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    TextField,
    Box,
    Typography,
    Container,
    Card,
    CardContent,
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import Logo from "../utils/Logo";
import {AppStoreButton} from "./AppStoreButton";

class ConfirmAccount extends Component {
    render() {
        const {confirmAccountStore} = this.props;
        const isDisabled = confirmAccountStore.username === '' || confirmAccountStore.confirmationCode === ''
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
                                    Confirm
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    textAlign="center"
                                    sx={{ mt: 1 }}
                                >
                                    {confirmAccountStore.confirmationCodePrompt}
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
                                    value={confirmAccountStore.username}
                                    onChange={(e) => confirmAccountStore.setUsername(e.target.value)}
                                    error={!!confirmAccountStore.errors.username}
                                    helperText={confirmAccountStore.errors.username}
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    required
                                    fullWidth
                                    name="confirmation"
                                    label="Confirmation Code"
                                    type="text"
                                    id="confirmation"
                                    autoComplete="confirmation-code"
                                    value={confirmAccountStore.confirmationCode}
                                    onChange={(e) => confirmAccountStore.setConfirmationCode(e.target.value)}
                                    error={!!confirmAccountStore.errors.confirmationCode}
                                    helperText={confirmAccountStore.errors.confirmationCode}
                                    sx={{ mb: 2 }}
                                />

                                <LoadingButton
                                    size={"medium"}
                                    variant="contained"
                                    color="primary"
                                    loading={confirmAccountStore.loading}
                                    disabled={isDisabled}
                                    onClick={async () => await confirmAccountStore.confirmAccount()}>
                                    Submit
                                </LoadingButton>
                            </Box>
                        </CardContent>
                    </Card>

                    <AppStoreButton url="https://apps.apple.com/us/app/nevvi/id1669915435" style={{marginTop: "2rem"}}/>
                </Box>
            </Container>
        );
    }
}

export default inject('confirmAccountStore')(observer(ConfirmAccount));