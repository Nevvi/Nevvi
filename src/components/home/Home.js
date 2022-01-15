import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {Button} from "@mui/material";

class Home extends Component {
    render() {
        const {authStore, routingStore} = this.props;
        if (authStore.isLoggedIn) {
            return <div>
                Hello!
            </div>
        }

        return <Button variant="contained" color="primary" onClick={() => {routingStore.push('/createAccount')}}>Create Account</Button>
    }
}

export default inject("routingStore", "authStore")(observer(Home));