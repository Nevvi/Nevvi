import React, {Component} from 'react';
import {Grid} from "@mui/material";

class Help extends Component {
    render() {
        return (
            <Grid container rowSpacing={1}>
                <Grid item xs={12}>
                    For help and questions email tyler.cobb@nevvi.net
                </Grid>
            </Grid>
        );
    }
}

export default Help;