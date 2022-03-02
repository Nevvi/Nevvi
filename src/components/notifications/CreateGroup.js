import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {Box, Grid, TextField} from "@mui/material";
import AdapterDayjs from "@mui/lab/AdapterDayjs";
import {DatePicker, LoadingButton, LocalizationProvider} from "@mui/lab";

class CreateGroup extends Component {
    render() {
        const {createNotificationGroupStore} = this.props;
        const isDisabled = createNotificationGroupStore.groupName === ""

        return <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={1}>
            <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TextField
                        fullWidth
                        variant="standard"
                        id="group-name-input"
                        label="Group Name"
                        type="text"
                        value={createNotificationGroupStore.groupName}
                        onChange={(e) => createNotificationGroupStore.setGroupName(e.target.value)}
                    />
                    <Box mt={3}>
                        <DatePicker
                            openTo="day"
                            views={['year', 'month', 'day']}
                            label="Expiration Date"
                            value={createNotificationGroupStore.expirationDate}
                            onChange={(expiration) => {
                                createNotificationGroupStore.setExpirationDate(expiration.format("YYYY-MM-DD"));
                            }}
                            renderInput={(params) => <TextField {...params} helperText={null}/>}
                        />
                    </Box>
                    <Box mt={3}>
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
                </LocalizationProvider>
            </Grid>
        </Grid>
    }
}

export default inject("createNotificationGroupStore")(observer(CreateGroup));