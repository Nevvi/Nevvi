import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {Box, Grid, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";

class CreateGroup extends Component {
    render() {
        const {createNotificationGroupStore} = this.props;
        const isDisabled = createNotificationGroupStore.groupName === ""

        return <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={1}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    variant="standard"
                    id="group-name-input"
                    label="Group Name"
                    type="text"
                    value={createNotificationGroupStore.groupName}
                    onChange={(e) => createNotificationGroupStore.setGroupName(e.target.value)}
                />
            </Grid>
            <Box mt={2}>
                <LoadingButton
                    size={"small"}
                    variant="contained"
                    color="primary"
                    loading={createNotificationGroupStore.loading}
                    disabled={isDisabled}
                    onClick={() => createNotificationGroupStore.createGroup()}
                >
                    Create Group
                </LoadingButton>
            </Box>
        </Grid>
    }
}

export default inject("createNotificationGroupStore")(observer(CreateGroup));