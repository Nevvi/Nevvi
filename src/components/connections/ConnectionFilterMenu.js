import React, {Component} from 'react';
import {IconButton, Menu, MenuItem, TextField} from "@mui/material";
import {inject, observer} from "mobx-react";
import {FilterAlt} from "@mui/icons-material";

class ConnectionFilterMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            open: false
        }
    }

    handleOpen(e) {
        this.setState({
            anchorEl: e.currentTarget,
            open: true
        })
    }

    handleClose() {
        this.setState({
            anchorEl: null,
            open: false
        })
    }

    render() {
        const {connectionsStore} = this.props;

        return <div>
            <IconButton
                className="connection-filter-button"
                color="default"
                onClick={(e) => {this.handleOpen(e)}}
                disableRipple
            >
                <FilterAlt/>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={this.state.anchorEl}
                open={this.state.open}
                onClose={() => this.handleClose()}
                PaperProps={{
                    style: {
                        width: "20rem",
                    },
                }}
            >
                <MenuItem dense disableRipple sx={{backgroundColor: "white !important", cursor: "auto"}}>
                    <TextField
                        id="connection-name-search"
                        label="Name"
                        variant="standard"
                        placeholder="Enter at least 3 characters"
                        fullWidth
                        autoFocus={true}
                        style={{marginBottom: "1rem"}}
                        value={connectionsStore.nameFilter}
                        onChange={(e) => connectionsStore.setNameFilter(e.target.value)}
                    />
                </MenuItem>
            </Menu>
        </div>
    }
}

export default inject("connectionsStore")(observer(ConnectionFilterMenu));