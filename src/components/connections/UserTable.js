import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Backdrop,
    CircularProgress,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import UserCard from "./UserCard";
import PermissionGroupModal from "./PermissionGroupModal";

class UserTable extends Component {
    componentWillUnmount() {
        const {usersStore} = this.props;
        usersStore.setNameFilter("")
    }

    render() {
        const {usersStore} = this.props;

        const rows = usersStore.users
        return (
            <Grid container sx={{mt: 2}}>
                <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={usersStore.loading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <Grid container item xs={12} rowSpacing={2}>
                    <TextField
                        id="user-name-search"
                        label="Name"
                        variant="standard"
                        placeholder="Enter at least 3 characters to search"
                        style={{width: "100%"}}
                        value={usersStore.nameFilter}
                        onChange={(e) => usersStore.setNameFilter(e.target.value)}
                    />

                    {!usersStore.nameFilter && <Typography
                        style={{
                            paddingTop: "1rem",
                            textAlign: "center",
                            fontStyle: "italic"
                        }}
                        component={"span"}
                    >
                        Enter a name filter to search for users
                    </Typography>}

                    {usersStore.nameFilter && usersStore.nameFilter.length > 3 && rows.length === 0 && <Typography
                        style={{
                            paddingTop: "1rem",
                            textAlign: "center",
                            fontStyle: "italic"
                        }}
                        component={"span"}
                    >
                        No users found
                    </Typography>}

                    {rows.map((row, index) => {
                        return <Grid item md={2} xs={12} key={`searched-user-card-${index}`} sx={{minWidth: "300px", p: "0.5rem"}}>
                            <UserCard user={row}/>
                        </Grid>
                    })}
                </Grid>

                <PermissionGroupModal handler={(userId, group) => usersStore.requestConnection(userId, group)}/>
            </Grid>
        );
    }
}

export default inject("usersStore")(observer(UserTable));