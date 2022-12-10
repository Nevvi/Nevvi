import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Backdrop,
    Box,
    CircularProgress,
    Fab,
    Grid,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import {Add} from "@material-ui/icons";
import {Link} from "react-router-dom";
import {router} from "../../router";
import UserCard from "./UserCard";
import ConnectionRequestCard from "./ConnectionRequestCard";

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
                    <Typography component={"span"}>{children}</Typography>
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

    componentDidMount() {
        const {connectionsStore} = this.props;
        connectionsStore.loadConnections()
        connectionsStore.loadRequests()
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
                <Grid container item xs={12} rowSpacing={2}>
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
                            {connectionsStore.connections.map((connection, index) => {
                                return <Grid item md={2} xs={12} key={`requesting-user-card-${index}`} className={'connection'}
                                             sx={{p: "0.5rem"}} onClick={() => {router.push(`/account/${connection.id}`)}}>
                                    <UserCard user={connection}/>
                                </Grid>
                            })}
                        </TabPanel>
                        <TabPanel value={selectedTab} index={1}>
                            {connectionsStore.requests.map((request, index) => {
                                return <Grid item md={2} xs={12} key={`requesting-user-card-${index}`}
                                             sx={{p: "0.5rem"}}>
                                    <ConnectionRequestCard request={request} />
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