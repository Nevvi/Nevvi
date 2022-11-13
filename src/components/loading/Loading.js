import React from "react";
import "bootstrap/dist/css/bootstrap.css";

import {CircularProgress} from "@mui/material";


export default class Loading extends React.Component {
    render() {
        if (!this.props.loading && this.props.component) return this.props.component

        return (
            <div>
                <CircularProgress/>
            </div>
        );
    }
}