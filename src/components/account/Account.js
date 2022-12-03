import React, {Component} from 'react';
import Loading from "../loading/Loading";
import {inject, observer} from "mobx-react";
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    InputAdornment,
    TextField
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {Check} from "@material-ui/icons";

class Account extends Component {
    constructor(props) {
        super(props);

        this.updateAccount = this.updateAccount.bind(this);
    }

    componentDidMount() {
        const {accountStore} = this.props;
        const userId = this.props.computedMatch.params.userId;
        accountStore.getUser(userId)
    }

    componentWillUnmount() {
        const {accountStore} = this.props;
        accountStore.reset()
    }

    async updateAccount(event) {
        event.preventDefault()
        const {accountStore} = this.props;
        await accountStore.saveUser()
    }

    render() {
        // Initial page load
        const {accountStore, confirmAttributeStore} = this.props;
        const user = accountStore.updatedUser;
        if (!user) {
            return <Loading component={<div/>} loading={accountStore.loading}/>
        }

        const isMe = accountStore.isMe

        // Subsequent page load
        return (
            <Grid container>
                <Grid item md={2} xs={12} sx={{textAlign: "center"}}>
                    <input
                        accept="image/*"
                        style={{display: 'none'}}
                        id="profile-image-button"
                        type="file"
                        disabled={!isMe}
                        onChange={(e) => accountStore.saveUserImage(e.target.files[0])}
                    />
                    <label htmlFor="profile-image-button">
                        {accountStore.imageLoading ?
                            <Avatar className="profile-image"><CircularProgress/></Avatar> :
                            <Avatar className={`${isMe ? 'my-profile-image' : 'profile-image'}`} src={user.profileImage}/>
                        }
                    </label>
                </Grid>
                <Grid container item md={4} xs={12} rowSpacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="standard"
                            id="email-input"
                            label="Email"
                            type="text"
                            value={user.email}
                            disabled
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    {user.emailConfirmed && isMe ? <Check/> : ''}
                                </InputAdornment>
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="standard"
                            id="phone-input"
                            label="Phone Number"
                            type="text"
                            disabled={user.phoneNumberConfirmed || !isMe}
                            value={user.phoneNumber || ""}
                            onChange={(e) => accountStore.updateUser("phoneNumber", e.target.value)}
                            InputProps={{
                                endAdornment: user.phoneNumber && isMe ? <InputAdornment position="end">
                                    {!user.phoneNumberConfirmed ?
                                        <LoadingButton
                                            loading={confirmAttributeStore.loading}
                                            onClick={() => confirmAttributeStore.sendPhoneConfirmCode()}
                                        >
                                            Verify
                                        </LoadingButton> :
                                        <Check/>
                                    }
                                </InputAdornment> : ''
                            }}
                        />
                    </Grid>
                    <Grid item md={6} xs={12} style={{paddingRight: "1rem"}}>
                        <TextField
                            fullWidth
                            variant="standard"
                            id="first-name-input"
                            label="First Name"
                            disabled={!isMe}
                            type="text"
                            value={user.firstName || ""}
                            onChange={(e) => accountStore.updateUser("firstName", e.target.value)}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            fullWidth
                            variant="standard"
                            id="last-name-input"
                            label="Last Name"
                            disabled={!isMe}
                            type="text"
                            value={user.lastName || ""}
                            onChange={(e) => accountStore.updateUser("lastName", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="standard"
                            id="street-address-input"
                            label="Street Address"
                            disabled={!isMe}
                            type="text"
                            value={(user.address && user.address.street) || ""}
                            onChange={(e) => accountStore.updateAddress("street", e.target.value)}
                        />
                    </Grid>
                    <Grid item md={4} xs={12} style={{paddingRight: "1rem"}}>
                        <TextField
                            fullWidth
                            variant="standard"
                            id="city-input"
                            label="City"
                            disabled={!isMe}
                            type="text"
                            value={(user.address && user.address.city) || ""}
                            onChange={(e) => accountStore.updateAddress("city", e.target.value)}
                        />
                    </Grid>
                    <Grid item md={4} xs={6} style={{paddingRight: "1rem"}}>
                        <TextField
                            fullWidth
                            variant="standard"
                            id="state-input"
                            label="State"
                            disabled={!isMe}
                            type="text"
                            value={(user.address && user.address.state) || ""}
                            onChange={(e) => accountStore.updateAddress("state", e.target.value)}
                        />
                    </Grid>
                    <Grid item md={4} xs={6}>
                        <TextField
                            fullWidth
                            variant="standard"
                            id="zipCode-input"
                            label="Zip Code"
                            disabled={!isMe}
                            type="text"
                            inputProps={{maxLength: 5}}
                            value={(user.address && user.address.zipCode) || ""}
                            onChange={(e) => accountStore.updateAddress("zipCode", e.target.value)}
                        />
                    </Grid>
                    <Box mt={2} mb={2}>
                        <LoadingButton
                            size={"small"}
                            sx={{display: isMe ? 'block' : 'none'}}
                            variant="contained"
                            color="primary"
                            loading={accountStore.loading}
                            disabled={!accountStore.hasUserChanged}
                            onClick={this.updateAccount}>
                            Update
                        </LoadingButton>
                    </Box>
                    <Dialog open={confirmAttributeStore.waitingConfirmationCode}>
                        <DialogTitle>Confirm Phone Number</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{confirmAttributeStore.confirmationCodePrompt}</DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Confirmation Code"
                                fullWidth
                                variant="standard"
                                value={confirmAttributeStore.confirmationCode}
                                onChange={(e) => confirmAttributeStore.setConfirmationCode(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button variant="text" color="primary"
                                    onClick={() => confirmAttributeStore.cancelConfirm()}>Cancel</Button>
                            <LoadingButton variant="contained" color="primary" loading={confirmAttributeStore.loading}
                                           onClick={() => confirmAttributeStore.confirmPhone()}>Confirm</LoadingButton>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        )
    }
}

export default inject("authStore", "accountStore", "confirmAttributeStore")(observer(Account));