import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Box, Fab,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip
} from "@mui/material";
import Loading from "../loading/Loading";
import {Add} from "@material-ui/icons";

class Groups extends Component {
    componentDidMount() {
        const {authStore, notificationGroupsStore} = this.props;
        notificationGroupsStore.getGroups(authStore.userId)
    }

    render() {
        const {notificationGroupsStore, routingStore} = this.props;
        return <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={12} md={6}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Subscribers</TableCell>
                                <TableCell align="right">Messages</TableCell>
                                <TableCell align="right">Created</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notificationGroupsStore.groups.map((group) => (
                                <TableRow
                                    key={group.name}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">{group.name}</TableCell>
                                    <TableCell align="right">0</TableCell>
                                    <TableCell align="right">0</TableCell>
                                    <TableCell align="right">{group.createDate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Loading
                    component={notificationGroupsStore.groups.length > 0 ?
                        <div/> :
                        <Box mt={1} sx={{fontStyle: 'italic', textAlign: "center"}}>No groups found</Box>
                    }
                    loading={notificationGroupsStore.loading}
                />
                <Tooltip title="Create Group" placement="top">
                    <Fab color="primary" aria-label="add" onClick={() => routingStore.push("/groups/create")} sx={{
                        margin: 0,
                        top: 'auto',
                        right: 30,
                        bottom: 30,
                        left: 'auto',
                        position: 'fixed',
                    }}>
                        <Add/>
                    </Fab>
                </Tooltip>
            </Grid>
        </Grid>
    }
}

export default inject("authStore", "routingStore", "notificationGroupsStore")(observer(Groups));