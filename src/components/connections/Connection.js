import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    TextField,
    Avatar,
    Tabs,
    Tab,
    Container,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Skeleton,
    IconButton,
    Divider,
    Alert,
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {MobileDatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
    Person,
    Email,
    Phone,
    Home,
    Cake,
    Settings,
    Delete,
    ArrowBack,
} from "@mui/icons-material";
import {router} from "../../router";

const TabPanel = ({ children, value, index, ...other }) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`connection-tabpanel-${index}`}
        aria-labelledby={`connection-tab-${index}`}
        {...other}
    >
        {value === index && <Box sx={{ pt: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
);

class Connection extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedTab: 0}
    }

    componentDidMount() {
        const {connectionStore} = this.props;
        const userId = this.props.computedMatch.params.userId;
        connectionStore.getConnection(userId)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {connectionStore} = this.props;
        const userId = this.props.computedMatch.params.userId;
        if (userId && connectionStore.connection && connectionStore.connection.id !== userId) {
            connectionStore.getConnection(userId)
        }
    }

    renderLoadingSkeleton = () => (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Stack spacing={3}>
                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                <Card>
                    <CardContent>
                        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                            <Skeleton variant="circular" width={100} height={100} />
                            <Stack spacing={1} sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="60%" height={32} />
                                <Skeleton variant="text" width="40%" height={24} />
                            </Stack>
                        </Stack>
                        <Grid container spacing={2}>
                            {[1, 2, 3, 4].map(i => (
                                <Grid item xs={12} sm={6} key={i}>
                                    <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );

    render() {
        const {accountStore, connectionStore} = this.props;
        const account = accountStore.user || {};
        const connection = connectionStore.connection;
        
        if (!connection || connectionStore.loading) {
            return this.renderLoadingSkeleton();
        }

        const {selectedTab} = this.state;

        return (
            <Container maxWidth="lg" sx={{ py: { xs: 1, sm: 3 } }}>
                {/* Header - Hide name on mobile to avoid repetition */}
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: { xs: 1.5, sm: 2 }, 
                        mb: { xs: 2, sm: 3 },
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <IconButton 
                            onClick={() => router.push('/connections')}
                            sx={{ 
                                backgroundColor: 'grey.100',
                                '&:hover': { backgroundColor: 'grey.200' }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="h4" component="h1">
                                {connection.firstName} {connection.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Connection Details
                            </Typography>
                        </Box>
                        {/* Mobile: Just show "Connection Details" */}
                        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <Typography variant="h6" component="h1">
                                Connection Details
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* Mobile Layout: Single Column */}
                <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
                    {/* Mobile Profile Header */}
                    <Card sx={{ mb: 2 }}>
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                            <Avatar
                                src={connection.profileImage}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mx: 'auto',
                                    mb: 1.5,
                                    fontSize: '1.8rem',
                                    fontWeight: 600,
                                    backgroundColor: 'secondary.main',
                                    border: '3px solid',
                                    borderColor: 'background.paper',
                                    boxShadow: 2,
                                }}
                            >
                                {connection.firstName?.charAt(0)}{connection.lastName?.charAt(0)}
                            </Avatar>
                            
                            <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                                {connection.firstName} {connection.lastName}
                            </Typography>
                            
                            {connection.email && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {connection.email}
                                </Typography>
                            )}

                            {/* Mobile: Clean contact info display */}
                            <Stack spacing={1.5} sx={{ mt: 2 }}>
                                {connection.phoneNumber && (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        backgroundColor: 'grey.50',
                                        borderRadius: 2,
                                        p: 1.5,
                                        gap: 1.5,
                                    }}>
                                        <Phone sx={{ color: 'primary.main', fontSize: 20 }} />
                                        <Typography variant="body2" fontWeight={500}>
                                            {connection.phoneNumber}
                                        </Typography>
                                    </Box>
                                )}
                                {connection.birthday && (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        backgroundColor: 'grey.50',
                                        borderRadius: 2,
                                        p: 1.5,
                                        gap: 1.5,
                                    }}>
                                        <Cake sx={{ color: 'primary.main', fontSize: 20 }} />
                                        <Typography variant="body2" fontWeight={500}>
                                            {dayjs(connection.birthday).format('MMM DD, YYYY')}
                                        </Typography>
                                    </Box>
                                )}
                                {(connection.address?.city || connection.address?.state) && (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        backgroundColor: 'grey.50',
                                        borderRadius: 2,
                                        p: 1.5,
                                        gap: 1.5,
                                    }}>
                                        <Home sx={{ color: 'primary.main', fontSize: 20 }} />
                                        <Typography variant="body2" fontWeight={500}>
                                            {`${connection.address?.city || ''} ${connection.address?.state || ''}`.trim()}
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Mobile Details Card */}
                    <Card>
                        <Tabs
                            value={selectedTab}
                            onChange={(e, v) => this.setState({selectedTab: v})}
                            variant="fullWidth"
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                '& .MuiTab-root': {
                                    minHeight: 56,
                                    fontSize: '0.875rem',
                                    px: 1,
                                },
                            }}
                        >
                            <Tab 
                                icon={<Person sx={{ fontSize: 20 }} />} 
                                iconPosition="top"
                                label="Info"
                            />
                            <Tab 
                                icon={<Settings sx={{ fontSize: 20 }} />} 
                                iconPosition="top"
                                label="Settings"
                            />
                        </Tabs>

                        <CardContent sx={{ p: 2 }}>
                            <TabPanel value={selectedTab} index={0}>
                                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                    Contact Information
                                </Typography>
                                
                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Email"
                                        value={connection.email || ''}
                                        disabled
                                        placeholder="No email provided"
                                    />

                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Phone"
                                        value={connection.phoneNumber || ''}
                                        disabled
                                        placeholder="No phone provided"
                                    />

                                    <MobileDatePicker
                                        label="Birthday"
                                        inputFormat="MM/DD/YYYY"
                                        disabled
                                        views={["year", "month", "day"]}
                                        value={(connection.birthday && dayjs(connection.birthday)) || null}
                                        onChange={() => {}}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params} 
                                                fullWidth
                                                size="small"
                                                placeholder="No birthday provided"
                                            />
                                        )}
                                    />
                                </Stack>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                    Address
                                </Typography>

                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Street"
                                        value={(connection.address && connection.address.street) || ''}
                                        disabled
                                        placeholder="No street address"
                                    />

                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="City"
                                        value={(connection.address && connection.address.city) || ''}
                                        disabled
                                        placeholder="No city"
                                    />

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <TextField
                                            sx={{ flex: 2 }}
                                            size="small"
                                            label="State"
                                            value={(connection.address && connection.address.state) || ''}
                                            disabled
                                            placeholder="No state"
                                        />
                                        <TextField
                                            sx={{ flex: 1 }}
                                            size="small"
                                            label="Zip"
                                            value={(connection.address && connection.address.zipCode) || ''}
                                            disabled
                                            placeholder="No zip"
                                        />
                                    </Box>
                                </Stack>
                            </TabPanel>

                            <TabPanel value={selectedTab} index={1}>
                                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                    Permission Group
                                </Typography>
                                
                                <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
                                    Controls what they can see about you
                                </Alert>

                                <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                    <InputLabel>Permission Group</InputLabel>
                                    <Select
                                        value={connectionStore.permissionGroup || ''}
                                        onChange={(e) => {
                                            connectionStore.setPermissionGroup(e.target.value)
                                            connectionStore.saveConnection()
                                        }}
                                        disabled={connectionStore.saving}
                                        label="Permission Group"
                                    >
                                        {(account.permissionGroups || []).map(pg => (
                                            <MenuItem key={pg.name} value={pg.name}>
                                                {pg.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle1" gutterBottom fontWeight={600} color="error.main">
                                    Remove Connection
                                </Typography>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<Delete />}
                                    onClick={() => connectionStore.setDeletePromptOpen(true)}
                                >
                                    Remove Connection
                                </Button>
                            </TabPanel>
                        </CardContent>
                    </Card>
                </Box>

                {/* Desktop Layout: Two Column */}
                <Grid container spacing={3} sx={{ display: { xs: 'none', lg: 'flex' } }}>
                    {/* Profile Card */}
                    <Grid item lg={4}>
                        <Card sx={{ position: 'sticky', top: 24 }}>
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                <Avatar
                                    src={connection.profileImage}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        mx: 'auto',
                                        mb: 2,
                                        fontSize: '2.5rem',
                                        fontWeight: 600,
                                        backgroundColor: 'secondary.main',
                                        border: '4px solid',
                                        borderColor: 'background.paper',
                                        boxShadow: 3,
                                    }}
                                >
                                    {connection.firstName?.charAt(0)}{connection.lastName?.charAt(0)}
                                </Avatar>
                                
                                <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                                    {connection.firstName} {connection.lastName}
                                </Typography>
                                
                                {connection.email && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {connection.email}
                                    </Typography>
                                )}

                                <Divider sx={{ my: 2 }} />

                                {/* Desktop: Professional contact info display */}
                                <Stack spacing={2}>
                                    {connection.phoneNumber && (
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            backgroundColor: 'grey.50',
                                            borderRadius: 2,
                                            p: 2,
                                            gap: 2,
                                        }}>
                                            <Phone sx={{ color: 'primary.main', fontSize: 22 }} />
                                            <Typography variant="body1" fontWeight={500}>
                                                {connection.phoneNumber}
                                            </Typography>
                                        </Box>
                                    )}
                                    {connection.birthday && (
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            backgroundColor: 'grey.50',
                                            borderRadius: 2,
                                            p: 2,
                                            gap: 2,
                                        }}>
                                            <Cake sx={{ color: 'primary.main', fontSize: 22 }} />
                                            <Typography variant="body1" fontWeight={500}>
                                                {dayjs(connection.birthday).format('MMM DD, YYYY')}
                                            </Typography>
                                        </Box>
                                    )}
                                    {(connection.address?.city || connection.address?.state) && (
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            backgroundColor: 'grey.50',
                                            borderRadius: 2,
                                            p: 2,
                                            gap: 2,
                                        }}>
                                            <Home sx={{ color: 'primary.main', fontSize: 22 }} />
                                            <Typography variant="body1" fontWeight={500}>
                                                {`${connection.address?.city || ''} ${connection.address?.state || ''}`.trim()}
                                            </Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Details Content - Desktop only full version */}
                    <Grid item lg={8}>
                        <Card>
                            <Tabs
                                value={selectedTab}
                                onChange={(e, v) => this.setState({selectedTab: v})}
                                sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    px: 2,
                                }}
                            >
                                <Tab
                                    icon={<Person />}
                                    iconPosition="start"
                                    label="Personal Info"
                                    sx={{ minHeight: 64 }}
                                />
                                <Tab
                                    icon={<Settings />}
                                    iconPosition="start"
                                    label="Connection Settings"
                                    sx={{ minHeight: 64 }}
                                />
                            </Tabs>

                            <CardContent sx={{ p: 3 }}>
                                <TabPanel value={selectedTab} index={0}>
                                    <Typography variant="h6" gutterBottom color="text.primary">
                                        Contact Information
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                value={connection.email || ''}
                                                disabled
                                                InputProps={{
                                                    startAdornment: <Email sx={{ mr: 2, color: 'action.active' }} />,
                                                }}
                                                placeholder="No email provided"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                value={connection.phoneNumber || ''}
                                                disabled
                                                InputProps={{
                                                    startAdornment: <Phone sx={{ mr: 2, color: 'action.active' }} />,
                                                }}
                                                placeholder="No phone provided"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <MobileDatePicker
                                                label="Birthday"
                                                inputFormat="MM/DD/YYYY"
                                                disabled
                                                views={["year", "month", "day"]}
                                                value={(connection.birthday && dayjs(connection.birthday)) || null}
                                                onChange={() => {}}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: <Cake sx={{ mr: 2, color: 'action.active' }} />,
                                                        }}
                                                        placeholder="No birthday provided"
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 3 }} />

                                    <Typography variant="h6" gutterBottom color="text.primary">
                                        Personal Details
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                value={connection.firstName || ''}
                                                disabled
                                                placeholder="Not provided"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                value={connection.lastName || ''}
                                                disabled
                                                placeholder="Not provided"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 3 }} />

                                    <Typography variant="h6" gutterBottom color="text.primary">
                                        Address
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Street Address"
                                                value={(connection.address && connection.address.street) || ''}
                                                disabled
                                                InputProps={{
                                                    startAdornment: <Home sx={{ mr: 2, color: 'action.active' }} />,
                                                }}
                                                placeholder="No street address provided"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="City"
                                                value={(connection.address && connection.address.city) || ''}
                                                disabled
                                                placeholder="No city provided"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="State"
                                                value={(connection.address && connection.address.state) || ''}
                                                disabled
                                                placeholder="No state provided"
                                            />
                                        </Grid>

                                        <Grid item xs={6} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="Zip Code"
                                                value={(connection.address && connection.address.zipCode) || ''}
                                                disabled
                                                inputProps={{maxLength: 5}}
                                                placeholder="No zip provided"
                                            />
                                        </Grid>
                                    </Grid>
                                </TabPanel>

                                <TabPanel value={selectedTab} index={1}>
                                    <Typography variant="h6" gutterBottom color="text.primary">
                                        Manage Connection
                                    </Typography>

                                    <Alert severity="info" sx={{ mb: 3 }}>
                                        Choose what permission group this connection belongs to. This controls what information they can see about you.
                                    </Alert>

                                    <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Permission Group</InputLabel>
                                            <Select
                                                value={connectionStore.permissionGroup || ''}
                                                onChange={(e) => {
                                                    connectionStore.setPermissionGroup(e.target.value)
                                                    connectionStore.saveConnection()
                                                }}
                                                disabled={connectionStore.saving}
                                                label="Permission Group"
                                            >
                                                {(account.permissionGroups || []).map(pg => (
                                                    <MenuItem key={pg.name} value={pg.name}>
                                                        {pg.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Card>

                                    <Divider sx={{ my: 3 }} />

                                    <Typography variant="h6" gutterBottom color="error.main">
                                        Danger Zone
                                    </Typography>

                                    <Card variant="outlined" sx={{ p: 3, borderColor: 'error.main' }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Removing this connection will prevent them from seeing your updates and vice versa.
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<Delete />}
                                            onClick={() => connectionStore.setDeletePromptOpen(true)}
                                        >
                                            Remove Connection
                                        </Button>
                                    </Card>
                                </TabPanel>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={connectionStore.deletePromptOpen}
                    onClose={() => connectionStore.setDeletePromptOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        Remove Connection?
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to remove <strong>{connection.firstName} {connection.lastName}</strong> from your connections?
                        </Typography>
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            This action will block them from seeing your information and prevent future connection requests unless you reconnect from your blocked users list.
                        </Alert>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => connectionStore.setDeletePromptOpen(false)}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            variant="contained"
                            color="error"
                            loading={connectionStore.deleting}
                            onClick={() => connectionStore.deleteConnection()}
                        >
                            Remove Connection
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Container>
        );
    }
}

export default inject('accountStore', 'connectionStore')(observer(Connection));