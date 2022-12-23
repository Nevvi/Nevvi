import React from 'react';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Slide,
    TextField, useMediaQuery, useTheme
} from "@mui/material";
import {inject, observer} from "mobx-react";
import {FilterAlt} from "@mui/icons-material";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ConnectionFilterMenu(props) {
    const {connectionsStore} = props;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [nameFilter, setNameFilter] = React.useState(connectionsStore.nameFilter);
    const open = Boolean(anchorEl)

    function handleOpen(e) {
        setAnchorEl(e.currentTarget)
    }

    function handleClose(e) {
        setAnchorEl(null)
    }

    function apply() {
        connectionsStore.setNameFilter(nameFilter)
        handleClose()
    }

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return <div>
        <IconButton
            className="connection-filter-button"
            color="default"
            onClick={(e) => {
                handleOpen(e)
            }}
            disableRipple
            size={"medium"}
        >
            <FilterAlt/>
        </IconButton>
        <Dialog
            fullScreen={isMobile}
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => handleClose()}
        >
            <DialogTitle>Connection Filters</DialogTitle>
            <DialogContent sx={{minWidth: "25rem"}}>
                <TextField
                    id="connection-name-search"
                    label="Name"
                    variant="standard"
                    placeholder="Enter at least 3 characters"
                    fullWidth
                    autoFocus={true}
                    style={{marginBottom: "1rem"}}
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>Cancel</Button>
                <Button onClick={() => apply()} variant={"contained"}>Apply</Button>
            </DialogActions>
        </Dialog>
    </div>
}

export default inject("connectionsStore")(observer(ConnectionFilterMenu));