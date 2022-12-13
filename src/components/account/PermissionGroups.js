import React, {Component} from 'react';
import Loading from "../loading/Loading";
import {inject, observer} from "mobx-react";
import {
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Fab, FormControlLabel, FormGroup,
    Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {Add} from "@mui/icons-material";
import {router} from "../../router";


class PermissionGroups extends Component {
    constructor(props) {
        super(props);
        this.updateAccount = this.updateAccount.bind(this);
    }

    componentDidMount() {
        const {accountStore} = this.props;
        const userId = this.props.computedMatch.params.userId;
        accountStore.getUser(userId)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {accountStore} = this.props;
        const userId = this.props.computedMatch.params.userId;
        if (userId && accountStore.user && accountStore.user.id !== userId) {
            accountStore.getUser(userId)
        }
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
        const user = accountStore.updatedUser;
        if (!user) {
            return <Loading component={<div/>} loading={accountStore.loading}/>
        }

        const isMe = accountStore.isMe
        if (!isMe) {
            router.push("/")
        }

        // Subsequent page load
        return (
            <Grid container item md={5} xs={12} rowSpacing={2} columnSpacing={2}>
                <TableContainer>
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
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{group.name}</TableCell>
                                    <TableCell align="right">{group.fields.join(", ")}</TableCell>
                                    <TableCell align="right">0</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Fab sx={{position: 'fixed', bottom: 16, right: 16}} color="primary" onClick={() => createPermissionGroupStore.setPermissionGroupPromptOpen(true)}>
                    <Add/>
                </Fab>

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
                            <FormControlLabel disabled checked control={<Checkbox/>} label="First Name" />
                            <FormControlLabel disabled checked control={<Checkbox/>} label="Last Name" />
                            <FormControlLabel disabled checked control={<Checkbox/>} label="Profile Picture" />
                            <FormControlLabel onChange={(e) => this.handleCheckboxUpdate(e, "email")}  control={<Checkbox/>} label="Email" />
                            <FormControlLabel onChange={(e) => this.handleCheckboxUpdate(e, "phoneNumber")} control={<Checkbox />} label="Phone Number" />
                            <FormControlLabel onChange={(e) => this.handleCheckboxUpdate(e, "address")} control={<Checkbox />} label="Address" />
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" color="primary" onClick={() => createPermissionGroupStore.setPermissionGroupPromptOpen(false)}>Cancel</Button>
                        <LoadingButton variant="contained" color="primary" loading={createPermissionGroupStore.loading} onClick={() => createPermissionGroupStore.saveGroup()}>Create</LoadingButton>
                    </DialogActions>
                </Dialog>
            </Grid>
        )
    }
}

export default inject("accountStore", "createPermissionGroupStore")(observer(PermissionGroups));