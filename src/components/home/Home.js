import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {Button} from "@mui/material";
import {router} from '../../router'

class Home extends Component {
    render() {
        const {authStore} = this.props;
        if (authStore.isLoggedIn) {
            return <div>
                Hello!
            </div>
        }

        return <Button variant="contained" color="primary" onClick={() => {router.push('/createAccount')}}>Create Account</Button>
    }
}

export default inject("authStore")(observer(Home));