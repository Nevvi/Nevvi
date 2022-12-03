import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Avatar,
    Backdrop,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";

class UserTable extends Component {
    componentWillUnmount() {
        const {usersStore} = this.props;
        usersStore.setNameFilter("")
    }

    render() {
        const {connectionsStore, usersStore} = this.props;

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
                        const isConnected = connectionsStore.isConnected(row.id);
                        return <Grid item md={2} xs={12} key={`searched-user-card-${index}`} sx={{p: "0.5rem"}}>
                            <Card sx={{width: "100%"}}>
                                <CardContent sx={{pb: "0.5rem"}}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{width: "4.5rem", height: "4.5rem"}} src={row.profileImage}/>
                                        <Stack>
                                            <Typography variant="p" component="span">
                                                {row.firstName} {row.lastName}
                                            </Typography>
                                                <LoadingButton
                                                    size="small"
                                                    sx={{
                                                        justifyContent: "left",
                                                        p: "0.5rem 0 0 0",
                                                        width: "fit-content"
                                                    }}
                                                    disabled={isConnected}
                                                    loading={usersStore.loading}
                                                    onClick={(e) => usersStore.requestConnection(row.id)}
                                                >
                                                    {isConnected ? "Connected" : "Connect"}
                                                </LoadingButton>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    })}
                </Grid>
            </Grid>
        );
    }
}

export default inject("connectionsStore", "usersStore")(observer(UserTable));