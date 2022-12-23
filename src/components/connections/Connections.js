import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Backdrop,
    Box,
    CircularProgress,
    Fab,
    Grid, InputAdornment,
    Pagination, styled,
    Tab,
    Tabs, TextField,
    Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import {router} from "../../router";
import UserCard from "./UserCard";
import ConnectionRequestCard from "./ConnectionRequestCard";
import {TabPanel} from "../../util/utils";
import {Add, Search} from "@mui/icons-material";
import PermissionGroupModal from "./PermissionGroupModal";

const StyledFab = styled(Fab)(({theme}) => ({
    [theme.breakpoints.up('sm')]: {
        width: "4rem",
        height: "4rem"
    },
    [theme.breakpoints.down('sm')]: {
        width: "3rem",
        height: "3rem"
    },
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    position: 'fixed',
    bottom: 16,
    right: 16,
    "&:hover": {
        backgroundColor: theme.palette.primary.dark
    }
}));

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
            <Grid container>
                <Backdrop sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                          open={connectionsStore.connectionsLoading || connectionsStore.requestsLoading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <Grid container item xs={12} rowSpacing={1}>
                    <Box style={{width: "100%"}}>
                        <Tabs
                            orientation={"horizontal"}
                            value={selectedTab}
                            onChange={(e, v) => this.setState({selectedTab: v})}
                        >
                            <Tab label={`My Connections`} key={'vertical-tab-0'}/>
                            <Tab label={`Requests (${connectionsStore.requests.length})`} key={'vertical-tab-1'}/>
                        </Tabs>
                        <TabPanel value={selectedTab} index={0}>
                            <TextField
                                id="connection-name-search"
                                variant="outlined"
                                placeholder="Enter at least 3 characters"
                                fullWidth
                                autoFocus={true}
                                style={{marginBottom: "1rem"}}
                                value={connectionsStore.nameFilter}
                                onChange={(e) => connectionsStore.setNameFilter(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Search/></InputAdornment>,
                                }}
                            />
                            {connectionsStore.nameFilter && connectionsStore.nameFilter.length >= 3 && connectionsStore.connections.length === 0 && <Typography
                                style={{
                                    paddingTop: "1rem",
                                    textAlign: "center",
                                    fontStyle: "italic"
                                }}
                                component={"span"}
                            >
                                No connections found
                            </Typography>}

                            <Grid container columnSpacing={2} rowSpacing={2}>
                                {connectionsStore.connections.map((connection, index) => {
                                    return <Grid item md={2} xs={12} key={`requesting-user-card-${index}`}
                                                 className={'connection'}
                                                 sx={{pt: "8px !important", minWidth: "300px"}} onClick={() => {
                                        router.push(`/account/${connection.id}`)
                                    }}>
                                        <UserCard user={connection}/>
                                    </Grid>
                                })}
                            </Grid>

                            {connectionsStore.connections.length > 0 &&
                                <Pagination
                                    sx={{marginTop: "1rem"}}
                                    siblingCount={0}
                                    page={connectionsStore.page}
                                    count={connectionsStore.pageCount}
                                    color="primary"
                                    onChange={(e, page) => connectionsStore.setPage(page)}
                                />
                            }
                        </TabPanel>
                        <TabPanel value={selectedTab} index={1}>
                            <Grid container columnSpacing={2} rowSpacing={2}>
                                {connectionsStore.requests.map((request, index) => {
                                    return <Grid item md={2} xs={12} key={`requesting-user-card-${index}`}
                                                 sx={{p: "0.5rem", minWidth: "400px"}}>
                                        <ConnectionRequestCard request={request}/>
                                    </Grid>
                                })}
                            </Grid>
                        </TabPanel>
                    </Box>
                </Grid>

                <Link to="/connections/new">
                    <StyledFab color="primary">
                        <Add/>
                    </StyledFab>
                </Link>

                <PermissionGroupModal handler={(userId, group) => connectionsStore.confirmRequest(userId, group)} />
            </Grid>
        );
    }
}

export default inject("connectionsStore")(observer(Connections));