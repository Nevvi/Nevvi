import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Box,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import Loading from "../loading/Loading";

class Groups extends Component {
    componentDidMount() {
        const {authStore, notificationGroupsStore} = this.props;
        notificationGroupsStore.getGroups(authStore.userId)
    }

    render() {
        const {notificationGroupsStore} = this.props;
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
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
                        <Box mt={1} sx={{ fontStyle: 'italic', textAlign: "center"}}>No groups found</Box>
                    }
                    loading={notificationGroupsStore.loading}
                />
            </Grid>
        </Grid>
    }
}

export default inject("authStore", "notificationGroupsStore")(observer(Groups));