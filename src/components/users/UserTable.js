import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import Box from "@mui/material/Box";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Backdrop, CircularProgress, Grid, TableHead, TextField, Typography} from "@mui/material";

class UserTable extends Component {
    render() {
        const {usersStore} = this.props;

        const rows = usersStore.users
        return (
            <Grid container sx={{mt: 2}}>
                <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={usersStore.loading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <Grid item md={3} xs={0}/>
                <Grid container item md={6} xs={12} rowSpacing={2}>
                    <TextField
                        id="user-name-search"
                        label="Name"
                        variant="standard"
                        placeholder="Enter at least 3 characters to search"
                        style={{width: "100%"}}
                        value={usersStore.nameFilter}
                        onChange={(e) => usersStore.setNameFilter(e.target.value)}
                    />
                    <Box sx={{width: '100%'}}>
                        <Paper sx={{width: '100%', mb: 2, mt: 3}}>
                            <TableContainer>
                                <Table
                                    sx={{minWidth: 750}}
                                    aria-labelledby="tableTitle"
                                    size={'medium'}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Phone Number</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, index) => {
                                            return (
                                                <TableRow key={row.name + index}>
                                                    <TableCell>{row.firstName} {row.lastName}</TableCell>
                                                    <TableCell>{row.email}</TableCell>
                                                    <TableCell>{row.phoneNumber}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {(usersStore.users.length === 0) &&
                                <Typography
                                    style={{
                                        padding: "1rem",
                                        textAlign: "center",
                                        fontStyle: "italic"
                                    }}
                                >
                                    Enter a name filter to search for users
                                </Typography>
                            }
                            {/*<IconButton*/}
                            {/*    aria-label="nextPage"*/}
                            {/*    disabled={usersStore.continuationKey === undefined || usersStore.loading}*/}
                            {/*    onClick={() => {usersStore.nextPage()}}*/}
                            {/*>*/}
                            {/*    <ChevronRight />*/}
                            {/*</IconButton>*/}
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        );
    }
}

export default inject("usersStore")(observer(UserTable));