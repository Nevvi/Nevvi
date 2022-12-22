import React, {Component} from 'react';
import {Avatar, Card, CardContent, Stack, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {inject, observer} from "mobx-react";

class ConnectionRequestCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accepting: false,
            denying: false
        }
    }

    async acceptRequest() {
        const {request, permissionGroupModalStore} = this.props;

        this.setState({accepting: true})
        try {
            await permissionGroupModalStore.initialize(request.requestingUserId)
        } finally {
            this.setState({accepting: false})
        }
    }

    async denyRequest() {
        const {request, connectionsStore} = this.props;

        this.setState({denying: true})
        try {
            await connectionsStore.denyRequest(request.requestingUserId)
        } finally {
            this.setState({denying: false})
        }
    }

    render() {
        const {request} = this.props;

        return <Card sx={{width: "100%"}}>
            <CardContent sx={{pb: "0.5rem"}}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{width: "4.5rem", height: "4.5rem"}}
                            src={request.requesterImage}/>
                    <Stack>
                        <Typography variant="p" component="span">{request.requestText}</Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <LoadingButton
                                size="small"
                                sx={{
                                    justifyContent: "left",
                                    p: "0.5rem 0 0 0",
                                    width: "fit-content"
                                }}
                                disabled={this.state.accepting || this.state.denying}
                                loading={this.state.accepting}
                                onClick={(e) => this.acceptRequest()}
                            >
                                Accept
                            </LoadingButton>
                            <LoadingButton
                                size="small"
                                sx={{
                                    justifyContent: "left",
                                    p: "0.5rem 0 0 0",
                                    width: "fit-content"
                                }}
                                disabled={this.state.accepting || this.state.denying}
                                loading={this.state.denying}
                                onClick={(e) => this.denyRequest()}
                            >
                                Deny
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    }
}

export default inject("connectionsStore", "permissionGroupModalStore")(observer(ConnectionRequestCard));