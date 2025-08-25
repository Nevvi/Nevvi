import React, {Component} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {inject, observer} from "mobx-react";

class PermissionGroupModal extends Component {
    render() {
        const {permissionGroupModalStore, handler} = this.props;

        return <Dialog
            open={permissionGroupModalStore.open}
            fullWidth={true}
            onClose={() => permissionGroupModalStore.reset()}
        >
            <DialogTitle>Select Permission Group</DialogTitle>
            <DialogContent>
                <FormControl>
                    <FormLabel id="permission-group-label">Permission Group</FormLabel>
                    <RadioGroup
                        aria-labelledby="permission-group-label"
                        value={permissionGroupModalStore.selectedGroup}
                        name="permission-group"
                    >
                        {((permissionGroupModalStore.user && permissionGroupModalStore.user.permissionGroups) || []).map(pg =>
                            <FormControlLabel key={pg.name} value={pg.name} control={<Radio onChange={(e) => {permissionGroupModalStore.setSelectedGroup(pg.name)}}/>} label={pg.name} />
                        )}
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="primary" onClick={() => permissionGroupModalStore.reset()}>Cancel</Button>
                <LoadingButton variant="contained" color="primary" loading={permissionGroupModalStore.submitting} onClick={() => permissionGroupModalStore.submit(handler)}>Confirm</LoadingButton>
            </DialogActions>
        </Dialog>
    }
}

export default inject("permissionGroupModalStore")(observer(PermissionGroupModal));