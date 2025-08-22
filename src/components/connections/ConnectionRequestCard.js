import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Avatar,
    Card,
    CardContent,
    Stack,
    Typography,
    Box,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Collapse,
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {
    CheckCircle,
    Cancel,
    Person,
} from "@mui/icons-material";

class ConnectionRequestCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accepting: false,
            denying: false,
            showPermissionSelect: false,
            selectedPermissionGroup: '',
        }
    }

    handleAcceptClick = () => {
        const {accountStore} = this.props;
        const permissionGroups = (accountStore.user && accountStore.user.permissionGroups) || [];

        if (permissionGroups.length === 0) {
            // If no permission groups, proceed directly
            this.acceptRequest();
        } else {
            // Show permission group selector
            this.setState({showPermissionSelect: true});
        }
    };

    async acceptRequest() {
        const {request, connectionsStore} = this.props;

        this.setState({accepting: true});
        try {
            await connectionsStore.confirmRequest(
                request.requestingUserId,
                this.state.selectedPermissionGroup || 'ALL'
            );
        } finally {
            this.setState({
                accepting: false,
                showPermissionSelect: false,
                selectedPermissionGroup: '',
            });
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

    // Add this helper method to ConnectionRequestCard as well
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
        const {request, accountStore} = this.props;
        const {accepting, denying, showPermissionSelect, selectedPermissionGroup} = this.state;
        const isProcessing = accepting || denying;
        const permissionGroups = (accountStore.user && accountStore.user.permissionGroups) || [];

        return (
            <Card
                sx={{
                    height: '100%',
                    transition: 'all 0.2s ease',
                    border: '2px solid',
                    borderColor: 'warning.light',
                    backgroundColor: 'warning.50',
                    '&:hover': {
                        transform: { xs: 'none', sm: 'translateY(-2px)' },
                        boxShadow: 4,
                        borderColor: 'warning.main',
                    },
                }}
            >
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    {/* User Info */}
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar
                            src={request.requesterImage}
                            sx={{
                                width: { xs: 56, sm: 64 },
                                height: { xs: 56, sm: 64 },
                                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                                fontWeight: 600,
                                backgroundColor: 'primary.main',
                                border: '3px solid',
                                borderColor: 'background.paper',
                                boxShadow: 2,
                                flexShrink: 0,
                            }}
                        >
                            {request.requesterFirstName?.charAt(0)}{request.requesterLastName?.charAt(0)}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="h6"
                                component="h3"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                    color: 'text.primary',
                                    lineHeight: 1.2,
                                    mb: 0.5,
                                }}
                            >
                                {request.requesterFirstName} {request.requesterLastName}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}
                            >
                                Wants to connect with you
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Permission Group Selector (Collapsible) */}
                    <Collapse in={showPermissionSelect}>
                        <Box sx={{ mb: 2 }}>
                            <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
                                Choose what information they can see about you
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
                                            <Box>
                                                <Typography variant="body2" fontWeight={500}>
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
                        </Box>
                    </Collapse>

                    {/* Action Buttons */}
                    <Stack
                        direction={{ xs: 'column', sm: showPermissionSelect ? 'column' : 'row' }}
                        spacing={1.5}
                        sx={{ mb: showPermissionSelect ? 0 : 2 }}
                    >
                        {!showPermissionSelect ? (
                            <>
                                <LoadingButton
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    size="medium"
                                    loading={accepting}
                                    disabled={isProcessing}
                                    onClick={this.handleAcceptClick}
                                    startIcon={!accepting && <CheckCircle />}
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '0.875rem', sm: '0.9rem' },
                                        py: { xs: 1, sm: 1.25 },
                                    }}
                                >
                                    {accepting ? 'Accepting...' : 'Accept'}
                                </LoadingButton>

                                <LoadingButton
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    size="medium"
                                    loading={denying}
                                    disabled={isProcessing}
                                    onClick={() => this.denyRequest()}
                                    startIcon={!denying && <Cancel />}
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '0.875rem', sm: '0.9rem' },
                                        py: { xs: 1, sm: 1.25 },
                                    }}
                                >
                                    {denying ? 'Denying...' : 'Deny'}
                                </LoadingButton>
                            </>
                        ) : (
                            <>
                                <LoadingButton
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    size="medium"
                                    loading={accepting}
                                    disabled={isProcessing || !selectedPermissionGroup}
                                    onClick={() => this.acceptRequest()}
                                    startIcon={!accepting && <CheckCircle />}
                                    sx={{ fontWeight: 600, py: 1.25 }}
                                >
                                    {accepting ? 'Confirming Connection...' : 'Confirm Connection'}
                                </LoadingButton>

                                <LoadingButton
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => this.setState({
                                        showPermissionSelect: false,
                                        selectedPermissionGroup: '',
                                    })}
                                    sx={{ fontWeight: 600 }}
                                >
                                    Cancel
                                </LoadingButton>
                            </>
                        )}
                    </Stack>

                    {/* Help Text - Only show when not selecting permission group */}
                    {!showPermissionSelect && (
                        <Alert
                            severity="info"
                            sx={{
                                fontSize: '0.8rem',
                                '& .MuiAlert-message': { py: 0.5 }
                            }}
                        >
                            You'll choose their permission group when accepting the request.
                        </Alert>
                    )}
                </CardContent>
            </Card>
        );
    }
}

export default inject("connectionsStore", "accountStore")(observer(ConnectionRequestCard));