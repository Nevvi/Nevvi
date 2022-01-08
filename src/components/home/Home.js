import React, {Component} from 'react';
import {Button} from "react-bootstrap";
import {inject, observer} from "mobx-react";

class Home extends Component {
    render() {
        const {authStore, routingStore} = this.props;
        if (authStore.isLoggedIn) {
            return <div>
                Hello!
            </div>
        }

        return <Button variant="primary" onClick={() => {routingStore.push('/createAccount')}}>Create Account</Button>
    }
}

export default inject("routingStore", "authStore")(observer(Home));