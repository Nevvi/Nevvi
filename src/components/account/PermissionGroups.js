import React, {Component} from 'react';
import Loading from "../loading/Loading";
import {inject, observer} from "mobx-react";
import {
    Box,
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel, FormGroup,
    Grid, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField
} from "@mui/material";
import {LoadingButton} from "@mui/lab";


class PermissionGroups extends Component {
    constructor(props) {
        super(props);
        this.updateAccount = this.updateAccount.bind(this);
    }

    async updateAccount(event) {
        event.preventDefault()
        const {accountStore} = this.props;
        await accountStore.saveUser()
    }

    handleCheckboxUpdate(e, field) {
        const {createPermissionGroupStore} = this.props;

        if (e.target.checked) {
            createPermissionGroupStore.addField(field)
        } else {
            createPermissionGroupStore.removeField(field)
        }
    }

    render() {
        // Initial page load
        const {accountStore, createPermissionGroupStore} = this.props;
        const user = accountStore.user;
        if (!user) {
            return <Loading component={<div/>} loading={accountStore.loading}/>
        }

        // Subsequent page load
        return (
            <Grid container item ml={0} mt={0} xs={12} rowSpacing={2} columnSpacing={2}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Group Name</TableCell>
                                <TableCell align="right">Fields</TableCell>
                                <TableCell align="right">Members</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {user.permissionGroups.map((group) => (
                                <TableRow
                                    key={group.name}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">{group.name}</TableCell>
                                    <TableCell align="right">{group.fields.join(", ")}</TableCell>
                                    <TableCell align="right">0</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Grid container justifyContent={"center"}>
                    <Box mt={2} mb={2}>
                        <Button
                            size={"small"}
                            variant="contained"
                            color="primary"
                            onClick={() => createPermissionGroupStore.setPermissionGroupPromptOpen(true)}
                        >
                            New Group
                        </Button>
                    </Box>
                </Grid>

                <Dialog
                    open={createPermissionGroupStore.permissionGroupPromptOpen}
                    fullWidth={true}
                    onClose={() => createPermissionGroupStore.setPermissionGroupPromptOpen(false)}
                >
                    <DialogTitle>New Permission Group</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            label="Group Name"
                            fullWidth
                            variant="standard"
                            error={createPermissionGroupStore.errorText !== ""}
                            helperText={createPermissionGroupStore.errorText}
                            value={createPermissionGroupStore.groupName}
                            onChange={(e) => createPermissionGroupStore.setGroupName(e.target.value)}
                        />
                        <FormGroup>
                            <FormControlLabel disabled checked control={<Checkbox/>} label="First Name"/>
                            <FormControlLabel disabled checked control={<Checkbox/>} label="Last Name"/>
                            <FormControlLabel disabled checked control={<Checkbox/>} label="Profile Picture"/>
                            <FormControlLabel onChange={(e) => this.handleCheckboxUpdate(e, "email")}
                                              control={<Checkbox/>} label="Email"/>
                            <FormControlLabel onChange={(e) => this.handleCheckboxUpdate(e, "phoneNumber")}
                                              control={<Checkbox/>} label="Phone Number"/>
                            <FormControlLabel onChange={(e) => this.handleCheckboxUpdate(e, "address")}
                                              control={<Checkbox/>} label="Address"/>
                            <FormControlLabel onChange={(e) => this.handleCheckboxUpdate(e, "birthday")}
                                              control={<Checkbox/>} label="Birthday"/>
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" color="primary"
                                onClick={() => createPermissionGroupStore.setPermissionGroupPromptOpen(false)}>Cancel</Button>
                        <LoadingButton variant="contained" color="primary" loading={createPermissionGroupStore.loading}
                                       onClick={() => createPermissionGroupStore.saveGroup()}>Create</LoadingButton>
                    </DialogActions>
                </Dialog>
            </Grid>
        )
    }
}

export default inject("accountStore", "createPermissionGroupStore")(observer(PermissionGroups));