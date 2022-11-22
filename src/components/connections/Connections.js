import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Avatar, Backdrop,
    Box, Card, CardContent, CircularProgress, Fab,
    Grid, Stack,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import {Add} from "@material-ui/icons";
import {Link} from "react-router-dom";
import {LoadingButton} from "@mui/lab";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <span
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{pt: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </span>
    );
}

class Connections extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedTab: 0}
    }

    componentWillUnmount() {
        const {connectionsStore} = this.props;
        connectionsStore.setNameFilter("")
    }

    render() {
        const {connectionsStore} = this.props;
        const {selectedTab} = this.state
        return (
            <Grid container sx={{mt: 2}}>
                <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}} open={connectionsStore.connectionsLoading || connectionsStore.requestsLoading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <Grid item md={3} xs={0}/>
                <Grid container item md={6} xs={12} rowSpacing={2}>
                    <Box style={{width: "100%"}}>
                        <Tabs
                            orientation={"horizontal"}
                            value={selectedTab}
                            onChange={(e, v) => this.setState({selectedTab: v})}
                        >
                            <Tab label={`My Connections (${connectionsStore.connections.length})`}
                                 key={'vertical-tab-0'}/>
                            <Tab label={`Requests (${connectionsStore.requests.length})`} key={'vertical-tab-1'}/>
                        </Tabs>
                        <TabPanel value={selectedTab} index={0}>
                            Item One
                        </TabPanel>
                        <TabPanel value={selectedTab} index={1}>
                            {connectionsStore.requests.map((request, index) => {
                                return <Grid item md={6} xs={12} key={`requesting-user-card-${index}`}
                                             sx={{p: "0.5rem"}}>
                                    <Card sx={{width: "100%"}}>
                                        <CardContent sx={{pb: "0.5rem"}}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{width: "4.5rem", height: "4.5rem"}}
                                                        src={request.requesterImage}/>
                                                <Stack>
                                                    <Typography variant="p" component="div">{request.requestText}</Typography>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <LoadingButton
                                                            size="small"
                                                            sx={{
                                                                justifyContent: "left",
                                                                p: "0.5rem 0 0 0",
                                                                width: "fit-content"
                                                            }}
                                                            loading={connectionsStore.confirmationLoading}
                                                            onClick={(e) => connectionsStore.confirmRequest(request.requestingUserId)}
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
                                                            loading={connectionsStore.confirmationLoading}
                                                            onClick={(e) => console.log(e)}
                                                        >
                                                            Deny
                                                        </LoadingButton>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            })}
                        </TabPanel>
                    </Box>
                </Grid>
                <Link to="/connections/new">
                    <Fab sx={{position: 'absolute', bottom: 16, right: 16}} color="primary">
                        <Add/>
                    </Fab>
                </Link>
            </Grid>
        );
    }
}

export default inject("connectionsStore")(observer(Connections));