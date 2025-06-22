import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {Alert, Box, Grid, Paper, TextField, Typography} from "@mui/material";
import {MobileDatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {LoadingButton} from "@mui/lab";
import Logo from "../utils/Logo";

class InviteForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const {inviteFormStore} = this.props;
        const inviteId = this.props.computedMatch.params.inviteId;
        inviteFormStore.getInvite(inviteId)
    }

    async handleSubmit(e) {
        e.preventDefault()
        const {inviteFormStore} = this.props;
        await inviteFormStore.submitForm();
    }

    render() {
        const {inviteFormStore} = this.props;
        if (inviteFormStore.submitted) {
            return (
                <Paper elevation={3} sx={{p: 4, maxWidth: 600, mx: 'auto', mt: 2}}>
                    <Alert severity="success">
                        <Typography variant="h6">Invite Accepted!</Typography>
                        <Typography>Thank you for providing your information. We will text you a temporary password to
                            login to your free account.
                        </Typography>
                    </Alert>
                </Paper>
            );
        }

        return (
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
                <Paper elevation={3} sx={{p: 4, maxWidth: 600, mx: 'auto'}}>
                    <Logo/>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Accept Invitation
                    </Typography>

                    <Box sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="firstName"
                                    label="First Name"
                                    value={inviteFormStore.firstName}
                                    onChange={(e) => inviteFormStore.setFirstName(e.target.value)}
                                    error={!!inviteFormStore.errors.firstName}
                                    helperText={inviteFormStore.errors.firstName}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="lastName"
                                    label="Last Name"
                                    value={inviteFormStore.lastName}
                                    onChange={(e) => inviteFormStore.setLastName(e.target.value)}
                                    error={!!inviteFormStore.errors.lastName}
                                    helperText={inviteFormStore.errors.lastName}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    disabled
                                    fullWidth
                                    name="phoneNumber"
                                    label="Phone Number"
                                    value={inviteFormStore.phoneNumber}
                                    onChange={(e) => inviteFormStore.setPhoneNumber(e.target.value)}
                                    error={!!inviteFormStore.errors.phoneNumber}
                                    helperText={inviteFormStore.errors.phoneNumber}
                                    variant="outlined"
                                    placeholder="e.g., +1 (555) 123-4567"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    value={inviteFormStore.email}
                                    onChange={(e) => inviteFormStore.setEmail(e.target.value)}
                                    error={!!inviteFormStore.errors.email}
                                    helperText={inviteFormStore.errors.email}
                                    variant="outlined"
                                    placeholder="your.email@example.com"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="address"
                                    label="Address"
                                    value={inviteFormStore.address}
                                    onChange={(e) => inviteFormStore.setAddress(e.target.value)}
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    placeholder="Street, city, state, zip code"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <MobileDatePicker
                                    label="Birthday"
                                    inputFormat="MM/DD/YYYY"
                                    views={["year", "month", "day"]}
                                    value={(inviteFormStore.birthday && dayjs(inviteFormStore.birthday)) || null}
                                    onChange={(birthday) => inviteFormStore.setBirthday(birthday.format("YYYY-MM-DD"))}
                                    renderInput={(params) => <TextField
                                        variant="outlined"
                                        name="birthday"
                                        label="birthday"
                                        {...params}
                                        sx={{width: "100%"}}
                                    />}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{mt: 3, display: 'flex', justifyContent: 'center'}}>
                            <LoadingButton
                                size={"medium"}
                                variant="contained"
                                color="primary"
                                loading={inviteFormStore.loading}
                                disabled={inviteFormStore.loading}
                                onClick={this.handleSubmit}>
                                Submit
                            </LoadingButton>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        );
    }
}

export default inject("inviteFormStore")(observer(InviteForm));