import React, {Component} from 'react';
import {Avatar, Card, CardContent, Stack, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {inject, observer} from "mobx-react";

class UserCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    async requestConnection() {
        const {user, permissionGroupModalStore} = this.props;

        this.setState({loading: true})
        try {
            await permissionGroupModalStore.initialize(user.id)
        } finally {
            this.setState({loading: false})
        }
    }

    render() {
        const {user, connectionsStore} = this.props;
        const isConnected = connectionsStore.isConnected(user.id);

        return <Card sx={{width: "100%"}}>
            <CardContent sx={{p: "8px !important"}}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{width: "4rem", height: "4rem"}} src={user.profileImage}/>
                    <Stack>
                        <Typography variant="p" component="span">
                            {user.firstName} {user.lastName}
                        </Typography>
                        {!isConnected &&
                            <LoadingButton
                                size="small"
                                sx={{
                                    justifyContent: "left",
                                    p: "0.5rem 0 0 0",
                                    width: "fit-content"
                                }}
                                disabled={isConnected}
                                loading={this.state.loading}
                                onClick={(e) => this.requestConnection()}
                            >
                                Connect
                            </LoadingButton>
                        }
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    }
}

export default inject("connectionsStore", "permissionGroupModalStore", "usersStore")(observer(UserCard));