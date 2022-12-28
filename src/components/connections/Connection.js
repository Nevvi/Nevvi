import React, {Component} from 'react';
import Loading from "../loading/Loading";
import {inject, observer} from "mobx-react";
import {
    Avatar, FormControl,
    Grid, InputLabel, MenuItem, Select, Tab, Tabs,
    TextField
} from "@mui/material";
import {MobileDatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {TabPanel} from "../../util/utils";

class Connection extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedTab: 0}
    }

    componentDidMount() {
        const {connectionStore} = this.props;
        const userId = this.props.computedMatch.params.userId;
        connectionStore.getConnection(userId)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {connectionStore} = this.props;
        const userId = this.props.computedMatch.params.userId;
        if (userId && connectionStore.connection && connectionStore.connection.id !== userId) {
            connectionStore.getConnection(userId)
        }
    }

    render() {
        // Initial page load
        const {accountStore, connectionStore} = this.props;
        const account = accountStore.user || {};
        const connection = connectionStore.connection;
        if (!connection) {
            return <Loading component={<div/>} loading={connectionStore.loading}/>
        }

        // Subsequent page load
        return (
            <Grid container item xs={12} rowSpacing={2} columnSpacing={2}>
                <Grid container item md={4} sm={6} xs={12} rowSpacing={2} pr={"16px"}>
                    <Grid item xs={3}/>
                    <Grid container item xs={6} justifyContent={"center"}>
                        <input
                            accept="image/*"
                            style={{display: 'none'}}
                            id="profile-image-button"
                            type="file"
                            disabled
                        />
                        <label htmlFor="profile-image-button">
                            <Avatar className={'profile-image'} src={connection.profileImage}/>
                        </label>
                    </Grid>

                    <Grid item xs={12}>
                        <Tabs
                            orientation="horizontal"
                            value={this.state.selectedTab}
                            onChange={(e, v) => this.setState({selectedTab: v})}
                            sx={{marginBottom: "1rem"}}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab label="Personal Info"/>
                            <Tab label="Connection Settings"/>
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
                                        value={connection.email}
                                        disabled
                                    />
                                </Grid>
                                <Grid item md={6} xs={12} sx={{pr: ["0", "1rem"]}}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        id="phone-input"
                                        label="Phone Number"
                                        type="text"
                                        disabled
                                        value={connection.phoneNumber || ""}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <MobileDatePicker
                                        label="Birthday"
                                        inputFormat="MM/DD/YYYY"
                                        disabled
                                        views={["year", "month", "day"]}
                                        value={(connection.birthday && dayjs(connection.birthday)) || null}
                                        onChange={(date) => {
                                        }}
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
                                        disabled
                                        type="text"
                                        value={connection.firstName || ""}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        id="last-name-input"
                                        label="Last Name"
                                        disabled
                                        type="text"
                                        value={connection.lastName || ""}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        id="street-address-input"
                                        label="Street Address"
                                        disabled
                                        type="text"
                                        value={(connection.address && connection.address.street) || ""}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12} sx={{pr: ["0", "1rem"]}}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        id="city-input"
                                        label="City"
                                        disabled
                                        type="text"
                                        value={(connection.address && connection.address.city) || ""}
                                    />
                                </Grid>
                                <Grid item md={4} xs={6} sx={{pr: ["1rem"]}}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        id="state-input"
                                        label="State"
                                        disabled
                                        type="text"
                                        value={(connection.address && connection.address.state) || ""}
                                    />
                                </Grid>
                                <Grid item md={4} xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        id="zipCode-input"
                                        label="Zip Code"
                                        disabled
                                        type="text"
                                        inputProps={{maxLength: 5}}
                                        value={(connection.address && connection.address.zipCode) || ""}
                                    />
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={this.state.selectedTab} index={1}>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="connection-permission-group-label">Permission Group</InputLabel>
                                <Select
                                    labelId="connection-permission-group-label"
                                    id="connection-permission-group-select"
                                    value={connectionStore.permissionGroup}
                                    onChange={(e) => {
                                        connectionStore.setPermissionGroup(e.target.value)
                                        connectionStore.saveConnection()
                                    }}
                                    disabled={connectionStore.saving}
                                    label="Permission Group"
                                >
                                    {(account.permissionGroups || []).map(pg => {
                                        return <MenuItem key={pg.name} value={pg.name}>{pg.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </TabPanel>
                    </Grid>

                </Grid>
            </Grid>
        )
    }
}

export default inject("authStore", "accountStore", "connectionStore")(observer(Connection));