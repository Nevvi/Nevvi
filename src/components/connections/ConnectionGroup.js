import React, {useEffect, useState} from 'react';
import {inject, observer} from 'mobx-react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {ArrowBack, Email, FileDownload, MoreVert, PersonAdd, Phone, Search,} from '@mui/icons-material';
import {LoadingButton} from '@mui/lab';
import {router} from '../../router';
import Loading from "../loading/Loading";

const ConnectionGroup = ({ connectionGroupStore, connectionsStore, accountStore, computedMatch }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const groupId = computedMatch.params.groupId;

    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [connectionToRemove, setConnectionToRemove] = useState(null);
    const [selectedConnections, setSelectedConnections] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedConnectionMenu, setSelectedConnectionMenu] = useState(null);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);

    useEffect(() => {
        connectionGroupStore.getGroup(groupId);

        return () => {
            connectionGroupStore.reset();
        };
    }, [connectionGroupStore, groupId]);

    useEffect(() => {
        // Load connections when add dialog opens
        if (addDialogOpen && !connectionsStore.connections.length) {
            connectionsStore.loadConnections();
        }
    }, [addDialogOpen, connectionsStore]);

    useEffect(() => {
        // Reset connections store search when dialog closes
        if (!addDialogOpen) {
            connectionsStore.setNameFilter('');
        }
    }, [addDialogOpen, connectionsStore]);

    const handleAddConnection = async () => {
        if (selectedConnections.length > 0) {
            // Use bulk add method for better performance
            const connectionIds = selectedConnections.map(connection => connection.id);
            await connectionGroupStore.addMultipleToGroup(connectionIds);
            setAddDialogOpen(false);
            setSelectedConnections([]);
        }
    };

    const handleRemoveConnection = async (connectionToRemove) => {
        if (connectionToRemove) {
            await connectionGroupStore.removeFromGroup(connectionToRemove.id);
            setRemoveDialogOpen(false);
            setConnectionToRemove(null);
        }
    };

    const handleExportGroup = async () => {
        setSpeedDialOpen(false);
        await connectionGroupStore.exportGroup();
    };

    const openRemoveDialog = (connection) => {
        setConnectionToRemove(connection);
        setRemoveDialogOpen(true);
        handleCloseMenu();
    };

    const handleMenuClick = (event, connection) => {
        event.stopPropagation();
        setMenuAnchor(event.currentTarget);
        setSelectedConnectionMenu(connection);
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null);
        setSelectedConnectionMenu(null);
    };

    if (connectionGroupStore.loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Loading />
            </Container>
        );
    }

    const group = connectionGroupStore.group;
    const connections = group?.connections || [];
    const user = accountStore.user;
    const canExport = user?.email && user?.emailConfirmed;

    // Filter available connections (not already in group)
    const groupConnectionIds = new Set(connections.map(c => c.id));
    const availableConnections = connectionsStore.connections.filter(
        connection => !groupConnectionIds.has(connection.id)
    );

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 1, sm: 3 } }}>
            {/* Header */}
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
                        onClick={() => router.push('/connections/groups')}
                        sx={{
                            backgroundColor: 'grey.100',
                            '&:hover': { backgroundColor: 'grey.200' }
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" component="h1">
                            {group?.name || 'Connection Group'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {connections.length} connection{connections.length !== 1 ? 's' : ''} in this group
                        </Typography>
                    </Box>
                    {!isMobile && (
                        <Stack direction="row" spacing={2}>
                            {canExport && connections.length > 0 && (
                                <LoadingButton
                                    variant="outlined"
                                    startIcon={<FileDownload />}
                                    loading={connectionGroupStore.exporting}
                                    onClick={handleExportGroup}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        px: 3,
                                    }}
                                >
                                    Export
                                </LoadingButton>
                            )}
                            <Button
                                variant="contained"
                                startIcon={<PersonAdd />}
                                onClick={() => setAddDialogOpen(true)}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    px: 3,
                                }}
                            >
                                Add Connection
                            </Button>
                        </Stack>
                    )}
                </Stack>
            </Paper>

            {/* Connections Grid */}
            {connections.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <PersonAdd sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                        No connections in this group
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Add connections to this group to see them here.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={() => setAddDialogOpen(true)}
                    >
                        Add Your First Connection
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    {connections.map((connection) => (
                        <Grid item xs={12} sm={4} md={3} lg={3} key={connection.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: theme.shadows[4],
                                    },
                                }}
                                onClick={() => router.push(`/connections/${connection.id}`)}
                            >
                                <CardContent sx={{
                                    p: { xs: 2, sm: 2 },
                                    position: 'relative',
                                    '&:last-child': { pb: { xs: 2, sm: 2 } }
                                }}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuClick(e, connection)}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            },
                                        }}
                                    >
                                        <MoreVert fontSize="small" />
                                    </IconButton>

                                    {/* Mobile: Row Layout */}
                                    {isMobile ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                src={connection.profileImage}
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    fontSize: '1.2rem',
                                                    fontWeight: 600,
                                                    backgroundColor: 'secondary.main',
                                                }}
                                            >
                                                {connection.firstName?.charAt(0)}{connection.lastName?.charAt(0)}
                                            </Avatar>

                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography
                                                    variant="subtitle1"
                                                    component="h3"
                                                    fontWeight={600}
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {connection.firstName} {connection.lastName}
                                                </Typography>

                                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                    {connection.email && (
                                                        <Chip
                                                            icon={<Email sx={{ fontSize: '0.7rem !important' }} />}
                                                            label="Email"
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{
                                                                fontSize: '0.7rem',
                                                                height: 20,
                                                            }}
                                                        />
                                                    )}

                                                    {connection.phoneNumber && (
                                                        <Chip
                                                            icon={<Phone sx={{ fontSize: '0.7rem !important' }} />}
                                                            label="Phone"
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{
                                                                fontSize: '0.7rem',
                                                                height: 20,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    ) : (
                                        /* Desktop: Column Layout */
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Avatar
                                                src={connection.profileImage}
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    mx: 'auto',
                                                    mb: 1,
                                                    fontSize: '1.5rem',
                                                    fontWeight: 600,
                                                    backgroundColor: 'secondary.main',
                                                }}
                                            >
                                                {connection.firstName?.charAt(0)}{connection.lastName?.charAt(0)}
                                            </Avatar>

                                            <Typography
                                                variant="subtitle2"
                                                component="h3"
                                                gutterBottom
                                                fontWeight={600}
                                                sx={{
                                                    fontSize: '0.875rem',
                                                    lineHeight: 1.2,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {connection.firstName} {connection.lastName}
                                            </Typography>

                                            <Box sx={{ mt: 1 }}>
                                                {connection.email && (
                                                    <Chip
                                                        icon={<Email sx={{ fontSize: '0.7rem !important' }} />}
                                                        label={connection.email}
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            fontSize: '0.65rem',
                                                            height: 20,
                                                            mb: 0.5,
                                                            display: 'flex',
                                                            maxWidth: '100%',
                                                            '& .MuiChip-label': {
                                                                px: 1,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }
                                                        }}
                                                    />
                                                )}

                                                {connection.phoneNumber && (
                                                    <Chip
                                                        icon={<Phone sx={{ fontSize: '0.7rem !important' }} />}
                                                        label={connection.phoneNumber}
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            fontSize: '0.65rem',
                                                            height: 20,
                                                            mb: 0.5,
                                                            display: 'flex',
                                                            '& .MuiChip-label': {
                                                                px: 1,
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Mobile SpeedDial */}
            {isMobile && (
                <SpeedDial
                    ariaLabel="Actions"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    icon={<SpeedDialIcon />}
                    open={speedDialOpen}
                    onClose={() => setSpeedDialOpen(false)}
                    onOpen={() => setSpeedDialOpen(true)}
                >
                    <SpeedDialAction
                        key="add"
                        icon={<PersonAdd />}
                        tooltipTitle="Add Connection"
                        onClick={() => {
                            setSpeedDialOpen(false);
                            setAddDialogOpen(true);
                        }}
                    />
                    {canExport && connections.length > 0 && (
                        <SpeedDialAction
                            key="export"
                            icon={connectionGroupStore.exporting ? <CircularProgress size={20} /> : <FileDownload />}
                            tooltipTitle="Export Group"
                            onClick={handleExportGroup}
                        />
                    )}
                </SpeedDial>
            )}

            {/* Connection Menu */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => router.push(`/connections/${selectedConnectionMenu?.id}`)}>
                    View Details
                </MenuItem>
                <MenuItem
                    onClick={() => openRemoveDialog(selectedConnectionMenu)}
                    sx={{ color: 'error.main' }}
                >
                    Remove from Group
                </MenuItem>
            </Menu>

            {/* Add Connection Dialog */}
            <Dialog
                open={addDialogOpen}
                onClose={() => {
                    setAddDialogOpen(false);
                    setSelectedConnections([]);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add Connection to Group</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Select connections to add to "{group?.name}". You can select multiple connections.
                    </Typography>
                    {selectedConnections.length > 0 && (
                        <Typography variant="body2" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
                            {selectedConnections.length} connection{selectedConnections.length !== 1 ? 's' : ''} selected
                        </Typography>
                    )}

                    <TextField
                        fullWidth
                        placeholder="Search connections..."
                        value={connectionsStore.nameFilter}
                        onChange={(e) => connectionsStore.setNameFilter(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />

                    {connectionsStore.connectionsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : availableConnections.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <Typography variant="body2" color="textSecondary">
                                {connectionsStore.connections.length === 0 && connectionsStore.nameFilter
                                    ? "No connections match your search"
                                    : connectionsStore.connections.length === 0
                                    ? "No connections found"
                                    : "All your connections are already in this group"}
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                            {availableConnections.map((connection) => {
                                const isSelected = selectedConnections.some(sc => sc.id === connection.id);
                                return (
                                    <ListItemButton
                                        key={connection.id}
                                        selected={isSelected}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedConnections(prev => prev.filter(sc => sc.id !== connection.id));
                                            } else {
                                                setSelectedConnections(prev => [...prev, connection]);
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                checked={isSelected}
                                                tabIndex={-1}
                                                disableRipple
                                                color="primary"
                                            />
                                        </ListItemIcon>
                                        <ListItemAvatar>
                                            <Avatar src={connection.profileImage}>
                                                {connection.firstName?.charAt(0)}{connection.lastName?.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${connection.firstName} ${connection.lastName}`}
                                            secondary={connection.email || connection.phoneNumber}
                                        />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setAddDialogOpen(false);
                        setSelectedConnections([]);
                    }}>
                        Cancel
                    </Button>
                    <LoadingButton
                        variant="contained"
                        loading={connectionGroupStore.saving}
                        disabled={selectedConnections.length === 0}
                        onClick={handleAddConnection}
                    >
                        Add {selectedConnections.length > 0 ? `${selectedConnections.length} ` : ''}Connection{selectedConnections.length !== 1 ? 's' : ''} to Group
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            {/* Remove Connection Dialog */}
            <Dialog
                open={removeDialogOpen}
                onClose={() => {
                    setRemoveDialogOpen(false);
                    setConnectionToRemove(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Remove Connection from Group</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="textSecondary">
                        Are you sure you want to remove{' '}
                        <strong>{connectionToRemove?.firstName} {connectionToRemove?.lastName}</strong>{' '}
                        from "{group?.name}"?
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                        This will not delete the connection, just remove them from this group.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setRemoveDialogOpen(false);
                        setConnectionToRemove(null);
                    }}>
                        Cancel
                    </Button>
                    <LoadingButton
                        variant="contained"
                        color="error"
                        loading={connectionGroupStore.saving}
                        onClick={() => handleRemoveConnection(connectionToRemove)}
                    >
                        Remove from Group
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default inject('connectionGroupStore', 'connectionsStore', 'accountStore')(observer(ConnectionGroup));