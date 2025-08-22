import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    Card,
    CardContent,
    Fab,
    Container,
    Skeleton,
    Alert,
    Badge,
    Stack,
    Paper,
    Chip,
} from "@mui/material";
import {
    Search,
    Add,
    People,
    PersonAdd,
} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {router} from "../../router";
import UserCard from "./UserCard";
import ConnectionRequestCard from "./ConnectionRequestCard";

const TabPanel = ({ children, value, index, ...other }) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`connections-tabpanel-${index}`}
        aria-labelledby={`connections-tab-${index}`}
        {...other}
    >
        {value === index && <Box sx={{ pt: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
);

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

    renderLoadingSkeleton = () => {
        // Mobile: more compact skeleton items
        const items = Array.from({length: 8}, (_, i) => i);

        return (
            <Stack spacing={1}>
                {items.map(item => (
                    <Card key={item} sx={{ px: { xs: 1, sm: 2 }, py: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Skeleton variant="circular" width={40} height={40} />
                            <Stack sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="60%" height={20} />
                                <Skeleton variant="text" width="40%" height={16} />
                            </Stack>
                            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                        </Stack>
                    </Card>
                ))}
            </Stack>
        );
    };

    renderEmptyState = (type) => (
        <Paper
            sx={{
                p: { xs: 3, sm: 6 },
                textAlign: 'center',
                backgroundColor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200',
                mx: { xs: 1, sm: 0 },
            }}
        >
            {type === 'connections' ? (
                <>
                    <People sx={{ fontSize: { xs: 48, sm: 64 }, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No connections yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Start building your network
                    </Typography>
                    <Link to="/connections/new" style={{ textDecoration: 'none' }}>
                        <Chip
                            icon={<PersonAdd />}
                            label="Add Connection"
                            clickable
                            color="primary"
                            variant="filled"
                        />
                    </Link>
                </>
            ) : (
                <>
                    <PersonAdd sx={{ fontSize: { xs: 48, sm: 64 }, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No pending requests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Requests will appear here
                    </Typography>
                </>
            )}
        </Paper>
    );

    render() {
        const {connectionsStore} = this.props;
        const {selectedTab} = this.state;

        return (
            <Box sx={{ minHeight: '100vh' }}>
                {/* Reduced Container padding for mobile */}
                <Container
                    maxWidth="xl"
                    sx={{
                        py: { xs: 1, sm: 2 },
                        px: { xs: 1, sm: 3 },
                    }}
                >
                    {/* Compact Page Header */}
                    <Box sx={{ mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 0 } }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem' } }}
                        >
                            Connections
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            Manage your network and connection requests
                        </Typography>
                    </Box>

                    {/* Compact Tabs */}
                    <Paper elevation={0} sx={{ mb: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                        <Tabs
                            value={selectedTab}
                            onChange={(e, v) => this.setState({selectedTab: v})}
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                px: { xs: 1, sm: 2 },
                                minHeight: { xs: 48, sm: 64 },
                            }}
                        >
                            <Tab
                                icon={<People sx={{ fontSize: { xs: 20, sm: 24 } }} />}
                                iconPosition="start"
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span>Connections</span>
                                        <Chip
                                            label={connectionsStore.totalConnections}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>
                                }
                                sx={{
                                    minHeight: { xs: 48, sm: 64 },
                                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                }}
                            />
                            <Tab
                                icon={<PersonAdd sx={{ fontSize: { xs: 20, sm: 24 } }} />}
                                iconPosition="start"
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span>Requests</span>
                                        {connectionsStore.requests.length > 0 && (
                                            <Badge
                                                badgeContent={connectionsStore.requests.length}
                                                color="error"
                                                sx={{ '& .MuiBadge-badge': { position: 'static', transform: 'none' } }}
                                            />
                                        )}
                                    </Box>
                                }
                                sx={{
                                    minHeight: { xs: 48, sm: 64 },
                                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                }}
                            />
                        </Tabs>
                    </Paper>

                    {/* Tab Content */}
                    <TabPanel value={selectedTab} index={0}>
                        {/* Compact Search Bar */}
                        <Card sx={{ mb: { xs: 2, sm: 3 }, mx: { xs: 0, sm: 0 } }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    placeholder="Search connections..."
                                    value={connectionsStore.nameFilter}
                                    onChange={(e) => connectionsStore.setNameFilter(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search color="action" sx={{ fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'grey.50',
                                        },
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Search Results Alert */}
                        {connectionsStore.nameFilter && connectionsStore.nameFilter.length >= 3 && connectionsStore.connections.length === 0 && !connectionsStore.connectionsLoading && (
                            <Alert severity="info" sx={{ mb: { xs: 2, sm: 3 }, mx: { xs: 0, sm: 0 } }}>
                                No matches for "{connectionsStore.nameFilter}"
                            </Alert>
                        )}

                        {/* Loading State */}
                        {connectionsStore.connectionsLoading && this.renderLoadingSkeleton()}

                        {/* Connections Grid - Different layouts for mobile vs desktop */}
                        {!connectionsStore.connectionsLoading && connectionsStore.connections.length > 0 && (
                            <Grid container spacing={{ xs: 1, sm: 3 }}>
                                {connectionsStore.connections.map((connection, index) => (
                                    <Grid
                                        item
                                        xs={12}  // Full width on mobile for list view
                                        sm={6}   // Half width on small tablets
                                        md={4}   // Third width on medium screens
                                        lg={3}   // Quarter width on large screens
                                        key={`connection-${connection.id}-${index}`}
                                    >
                                        <Box
                                            onClick={() => router.push(`/connections/${connection.id}`)}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover .connection-card': {
                                                    transform: { xs: 'none', sm: 'translateY(-2px)' },
                                                    boxShadow: { xs: 1, sm: 4 },
                                                },
                                            }}
                                        >
                                            <UserCard user={connection} />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {/* Empty State */}
                        {!connectionsStore.connectionsLoading && connectionsStore.connections.length === 0 && !connectionsStore.nameFilter && (
                            this.renderEmptyState('connections')
                        )}
                    </TabPanel>

                    <TabPanel value={selectedTab} index={1}>
                        {/* Loading State */}
                        {connectionsStore.requestsLoading && this.renderLoadingSkeleton()}

                        {/* Requests Grid */}
                        {!connectionsStore.requestsLoading && connectionsStore.requests.length > 0 && (
                            <Grid container spacing={{ xs: 1, sm: 3 }}>
                                {connectionsStore.requests.map((request, index) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        key={`request-${request.id}-${index}`}
                                    >
                                        <ConnectionRequestCard request={request} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {/* Empty State */}
                        {!connectionsStore.requestsLoading && connectionsStore.requests.length === 0 && (
                            this.renderEmptyState('requests')
                        )}
                    </TabPanel>
                </Container>

                {/* Floating Action Button */}
                <Link to="/connections/new" style={{ textDecoration: 'none' }}>
                    <Fab
                        color="primary"
                        sx={{
                            position: 'fixed',
                            bottom: { xs: 16, sm: 24 },
                            right: { xs: 16, sm: 24 },
                            width: { xs: 48, sm: 56 },
                            height: { xs: 48, sm: 56 },
                            boxShadow: 4,
                            '&:hover': {
                                boxShadow: 8,
                                transform: { xs: 'none', sm: 'scale(1.05)' },
                            },
                            transition: 'all 0.2s ease',
                        }}
                        aria-label="add connection"
                    >
                        <Add sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </Fab>
                </Link>
            </Box>
        );
    }
}

export default inject("connectionsStore")(observer(Connections));