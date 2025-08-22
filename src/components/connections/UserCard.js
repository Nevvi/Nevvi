import React, {Component} from 'react';
import {
    Avatar,
    Card,
    CardContent,
    Stack,
    Typography,
    Box,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Collapse,
    Alert,
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {inject, observer} from "mobx-react";
import {PersonAdd, CheckCircle} from "@mui/icons-material";

class UserCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showPermissionSelect: false,
            selectedPermissionGroup: '',
        }
    }

    handleConnectClick = () => {
        const {accountStore} = this.props;
        const permissionGroups = (accountStore.user && accountStore.user.permissionGroups) || [];

        if (permissionGroups.length === 0) {
            // If no permission groups, proceed directly
            this.requestConnection();
        } else {
            // Show permission group selector
            this.setState({showPermissionSelect: true});
        }
    };

    async requestConnection() {
        const {user, usersStore} = this.props;

        this.setState({loading: true})
        try {
            await usersStore.requestConnection(
                user.id,
                this.state.selectedPermissionGroup || 'ALL'
            );
        } finally {
            this.setState({
                loading: false,
                showPermissionSelect: false,
                selectedPermissionGroup: '',
            });
        }
    }

    getPermissionGroupDescription = (group) => {
        // Special case for "All Info" or similar
        if (group.name?.toLowerCase().includes('all') ||
            group.name?.toLowerCase() === 'everything' ||
            group.name?.toLowerCase() === 'full access') {
            return 'Everything accessible';
        }

        return `${group.fields?.length || 0} field${(group.fields?.length || 0) !== 1 ? 's' : ''} accessible`;
    };

    render() {
        const {user, connectionsStore, accountStore} = this.props;
        const {loading, showPermissionSelect, selectedPermissionGroup} = this.state;
        const isConnected = connectionsStore?.isConnected(user.id);
        const permissionGroups = (accountStore.user && accountStore.user.permissionGroups) || [];

        return (
            <Card
                className="connection-card"
                sx={{
                    height: '100%',
                    transition: 'all 0.2s ease',
                    cursor: this.props.onClick ? 'pointer' : 'default',
                    // Ensure card doesn't overflow its container
                    minWidth: 0,
                    maxWidth: '100%',
                    '&:hover': {
                        transform: { xs: 'none', sm: 'translateY(-2px)' },
                        boxShadow: { xs: 1, sm: 4 },
                    },
                }}
            >
                <CardContent
                    sx={{
                        p: { xs: 1.5, sm: 3 }, // More padding on desktop
                        '&:last-child': { pb: { xs: 1.5, sm: 3 } },
                        // Ensure content doesn't overflow
                        minWidth: 0,
                    }}
                >
                    {/* Mobile Layout: Always horizontal */}
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: showPermissionSelect ? 2 : 0 }}>
                            {/* Avatar */}
                            <Avatar
                                src={user.profileImage}
                                sx={{
                                    width: 48,
                                    height: 48,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    backgroundColor: 'primary.main',
                                    border: '2px solid',
                                    borderColor: 'background.paper',
                                    boxShadow: 1,
                                    flexShrink: 0,
                                }}
                            >
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </Avatar>

                            {/* User Info - takes available space */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    variant="subtitle1"
                                    component="h3"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        lineHeight: 1.2,
                                        mb: 0.25,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {user.firstName} {user.lastName}
                                </Typography>

                                {user.phoneNumber && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: '0.8rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {user.phoneNumber}
                                    </Typography>
                                )}
                            </Box>

                            {/* Action Button - Only show if not selecting permission group */}
                            {!showPermissionSelect && (
                                <Box sx={{ flexShrink: 0 }}>
                                    {isConnected ? (
                                        <Chip
                                            icon={<CheckCircle sx={{ fontSize: 16 }} />}
                                            label="Connected"
                                            color="success"
                                            size="small"
                                            sx={{
                                                minWidth: 80,
                                                fontWeight: 500,
                                                fontSize: '0.75rem',
                                                height: 24,
                                            }}
                                        />
                                    ) : (
                                        <LoadingButton
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            loading={loading}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                this.handleConnectClick();
                                            }}
                                            startIcon={!loading && <PersonAdd sx={{ fontSize: 16 }} />}
                                            sx={{
                                                minWidth: 80,
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                px: 1.5,
                                                py: 0.5,
                                            }}
                                        >
                                            {loading ? 'Connecting...' : 'Connect'}
                                        </LoadingButton>
                                    )}
                                </Box>
                            )}
                        </Stack>

                        {/* Mobile Permission Group Selector */}
                        <Collapse in={showPermissionSelect}>
                            <Stack spacing={2} sx={{ pt: 0 }}>
                                <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
                                    Choose what they can see
                                </Alert>

                                <FormControl fullWidth size="small">
                                    <InputLabel>Permission Group</InputLabel>
                                    <Select
                                        value={selectedPermissionGroup}
                                        onChange={(e) => this.setState({selectedPermissionGroup: e.target.value})}
                                        label="Permission Group"
                                    >
                                        {permissionGroups.map(pg => (
                                            <MenuItem key={pg.name} value={pg.name}>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="body2" fontWeight={500} noWrap>
                                                        {pg.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {this.getPermissionGroupDescription(pg)}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Stack direction="row" spacing={1}>
                                    <LoadingButton
                                        fullWidth
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        loading={loading}
                                        disabled={loading || !selectedPermissionGroup}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.requestConnection();
                                        }}
                                        startIcon={!loading && <PersonAdd sx={{ fontSize: 16 }} />}
                                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                                    >
                                        {loading ? 'Connecting...' : 'Send'}
                                    </LoadingButton>

                                    <LoadingButton
                                        size="small"
                                        variant="outlined"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.setState({
                                                showPermissionSelect: false,
                                                selectedPermissionGroup: '',
                                            });
                                        }}
                                        sx={{ fontWeight: 600, fontSize: '0.75rem', minWidth: 60 }}
                                    >
                                        Cancel
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                        </Collapse>
                    </Box>

                    {/* Desktop Layout: Vertical */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Stack spacing={3} alignItems="center" textAlign="center">
                            {/* Avatar */}
                            <Avatar
                                src={user.profileImage}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    fontSize: '1.8rem',
                                    fontWeight: 600,
                                    backgroundColor: 'primary.main',
                                    border: '3px solid',
                                    borderColor: 'background.paper',
                                    boxShadow: 2,
                                }}
                            >
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </Avatar>

                            {/* User Info - Give more width */}
                            <Box sx={{ minWidth: 0, width: '100%', maxWidth: '280px', mx: 'auto' }}>
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '1.125rem',
                                        lineHeight: 1.2,
                                        mb: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {user.firstName} {user.lastName}
                                </Typography>

                                {user.phoneNumber && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: '0.9rem',
                                            mb: 2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {user.phoneNumber}
                                    </Typography>
                                )}

                                {/* Action Button - Desktop */}
                                {!showPermissionSelect && (
                                    <Box>
                                        {isConnected ? (
                                            <Chip
                                                icon={<CheckCircle sx={{ fontSize: 18 }} />}
                                                label="Connected"
                                                color="success"
                                                size="medium"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '0.875rem',
                                                    px: 2,
                                                    py: 0.5,
                                                }}
                                            />
                                        ) : (
                                            <LoadingButton
                                                variant="contained"
                                                color="primary"
                                                loading={loading}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    this.handleConnectClick();
                                                }}
                                                startIcon={!loading && <PersonAdd sx={{ fontSize: 18 }} />}
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem',
                                                    px: 3,
                                                    py: 1,
                                                    minWidth: 140, // Ensure button has good width
                                                }}
                                            >
                                                {loading ? 'Connecting...' : 'Connect'}
                                            </LoadingButton>
                                        )}
                                    </Box>
                                )}
                            </Box>

                            {/* Desktop Permission Group Selector - Wider container */}
                            <Collapse in={showPermissionSelect} sx={{ width: '100%', maxWidth: '300px' }}>
                                <Stack spacing={2.5}>
                                    <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                                        Choose what they can see about you
                                    </Alert>

                                    <FormControl fullWidth>
                                        <InputLabel>Permission Group</InputLabel>
                                        <Select
                                            value={selectedPermissionGroup}
                                            onChange={(e) => this.setState({selectedPermissionGroup: e.target.value})}
                                            label="Permission Group"
                                        >
                                            {permissionGroups.map(pg => (
                                                <MenuItem key={pg.name} value={pg.name}>
                                                    <Box>
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {pg.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {this.getPermissionGroupDescription(pg)}
                                                        </Typography>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {/* Desktop buttons: Stack vertically with better spacing */}
                                    <Stack spacing={1.5}>
                                        <LoadingButton
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            loading={loading}
                                            disabled={loading || !selectedPermissionGroup}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                this.requestConnection();
                                            }}
                                            startIcon={!loading && <PersonAdd sx={{ fontSize: 18 }} />}
                                            sx={{ 
                                                fontWeight: 600, 
                                                py: 1.25,
                                                fontSize: '0.875rem',
                                                minHeight: 44, // Consistent button height
                                            }}
                                        >
                                            {loading ? 'Sending Request...' : 'Send Request'}
                                        </LoadingButton>

                                        <LoadingButton
                                            fullWidth
                                            variant="outlined"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                this.setState({
                                                    showPermissionSelect: false,
                                                    selectedPermissionGroup: '',
                                                });
                                            }}
                                            sx={{ 
                                                fontWeight: 600, 
                                                py: 1,
                                                fontSize: '0.875rem',
                                                minHeight: 40, // Consistent button height
                                            }}
                                        >
                                            Cancel
                                        </LoadingButton>
                                    </Stack>
                                </Stack>
                            </Collapse>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        );
    }
}

export default inject("connectionsStore", "usersStore", "accountStore")(observer(UserCard));