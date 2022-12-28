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
    InputAdornment, Tab, Tabs,
    TextField
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {Check} from "@mui/icons-material";
import {MobileDatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {TabPanel} from "../../util/utils";
import PermissionGroups from "./PermissionGroups";
import UserCard from "../connections/UserCard";
import PermissionGroupModal from "../connections/PermissionGroupModal";

class Account extends Component {
    constructor(props) {
        super(props);
        this.updateAccount = this.updateAccount.bind(this);
        this.state = {selectedTab: 0}
    }

    async updateAccount(event) {
        event.preventDefault()
        const {accountStore} = this.props;
        await accountStore.saveUser()
    }

    render() {
        // Initial page load
        const {accountStore, confirmAttributeStore, connectionsStore} = this.props;
        const user = accountStore.updatedUser;
        if (!user) {
            return <Loading component={<div/>} loading={accountStore.loading}/>
        }

        // Subsequent page load
        return (
            <Grid container item xs={12}>
                <Grid container item md={4} sm={6} xs={12} rowSpacing={2} pr={"16px"}>
                    <Grid item xs={3}/>
                    <Grid container item xs={6} justifyContent={"center"}>
                        <input
                            accept="image/*"
                            style={{display: 'none'}}
                            id="profile-image-button"
                            type="file"
                            onChange={(e) => accountStore.saveUserImage(e.target.files[0])}
                        />
                        <label htmlFor="profile-image-button">
                            {accountStore.imageLoading ?
                                <Avatar className="profile-image"><CircularProgress/></Avatar> :
                                <Avatar className={'my-profile-image'} src={user.profileImage}/>
                            }
                        </label>
                    </Grid>

                    <Grid item xs={12}>
                        <Tabs
                            orientation="horizontal"
                            value={this.state.selectedTab}
                            onChange={(e, v) => this.setState({selectedTab: v})}
                            sx={{marginBottom: "1rem"}}
                            variant="scrollable"
                            scrollButtons={"auto"}
                            allowScrollButtonsMobile
                        >
                            <Tab label="Personal Info"/>
                            <Tab label="Permission Groups"/>
                            <Tab label="Blocked Users"/>
                        </Tabs>
                        <TabPanel value={this.state.selectedTab} index={0}>
                            <Grid container mt={0} rowSpacing={2} columnSpacing={2}>
                                <Grid item xs={12} sx={{pt: "0 !important"}}>
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
                                                {user.emailConfirmed ? <Check/> : ''}
                                            </InputAdornment>
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12} sx={{pr: ["0", "1rem"]}}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        id="phone-input"
                                        label="Phone Number"
                                        type="text"
                                        disabled={user.phoneNumberConfirmed}
                                        value={user.phoneNumber || ""}
                                        onChange={(e) => accountStore.updateUser("phoneNumber", e.target.value)}
                                        InputProps={{
                                            endAdornment: user.phoneNumber ? <InputAdornment position="end">
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
                                <Grid item md={6} xs={12}>
                                    <MobileDatePicker
                                        label="Birthday"
                                        inputFormat="MM/DD/YYYY"
                                        views={["year", "month", "day"]}
                                        value={(user.birthday && dayjs(user.birthday)) || null}
                                        onChange={(birthday) => accountStore.updateUser("birthday", birthday.format("YYYY-MM-DD"))}
                                        renderInput={(params) => <TextField variant="standard" {...params}
                                                                            sx={{width: "100%"}}/>}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12} sx={{pr: ["0", "1rem"]}}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        id="first-name-input"
                                        label="First Name"
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
                                        type="text"
                                        value={(user.address && user.address.street) || ""}
                                        onChange={(e) => accountStore.updateAddress("street", e.target.value)}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12} sx={{pr: ["0", "1rem"]}}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        id="city-input"
                                        label="City"
                                        type="text"
                                        value={(user.address && user.address.city) || ""}
                                        onChange={(e) => accountStore.updateAddress("city", e.target.value)}
                                    />
                                </Grid>
                                <Grid item md={4} xs={6} sx={{pr: ["1rem"]}}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        id="state-input"
                                        label="State"
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
                                        type="text"
                                        inputProps={{maxLength: 5}}
                                        value={(user.address && user.address.zipCode) || ""}
                                        onChange={(e) => accountStore.updateAddress("zipCode", e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Box mt={2} mb={2}>
                                <LoadingButton
                                    size={"small"}
                                    variant="contained"
                                    color="primary"
                                    loading={accountStore.loading}
                                    disabled={!accountStore.hasUserChanged}
                                    onClick={this.updateAccount}>
                                    Update
                                </LoadingButton>
                            </Box>
                        </TabPanel>
                        <TabPanel value={this.state.selectedTab} index={1}>
                            <PermissionGroups/>
                        </TabPanel>
                        <TabPanel value={this.state.selectedTab} index={2}>
                            <Grid container columnSpacing={2} rowSpacing={2}>
                                {accountStore.rejectedUsers.map((row, index) => {
                                    return <Grid item md={2} xs={12} key={`rejected-user-card-${index}`}
                                                 sx={{minWidth: "300px", p: "0.5rem"}}>
                                        <UserCard user={row}/>
                                    </Grid>
                                })}
                            </Grid>
                            <PermissionGroupModal handler={(userId, group) => {
                                connectionsStore.confirmRequest(userId, group).then(() => {
                                    accountStore.getRejectedUsers()
                                })
                            }} />
                        </TabPanel>
                    </Grid>
                </Grid>

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
        )
    }
}

export default inject("authStore", "accountStore", "confirmAttributeStore", "connectionsStore")(observer(Account));