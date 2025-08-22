import React, {useEffect, useState} from 'react';
import {inject, observer} from 'mobx-react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {Add, ChevronRight, Delete, Group,} from '@mui/icons-material';
import {router} from '../../router';
import Loading from "../loading/Loading";

const ConnectionGroups = inject('connectionGroupsStore')(observer(({connectionGroupsStore}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);

    // Load groups when component mounts
    useEffect(() => {
        connectionGroupsStore.loadGroups();
    }, [connectionGroupsStore]);

    const handleCreateGroup = async () => {
        if (groupName.trim()) {
            await connectionGroupsStore.createGroup(groupName.trim());
            setGroupName('');
            setCreateDialogOpen(false);
        }
    };

    const handleDeleteGroup = async () => {
        if (selectedGroup) {
            await connectionGroupsStore.deleteGroup(selectedGroup.id);
            setDeleteDialogOpen(false);
            setSelectedGroup(null);
        }
    };

    const openDeleteDialog = (group, event) => {
        // Prevent navigation when clicking delete button
        event.stopPropagation();
        setSelectedGroup(group);
        setDeleteDialogOpen(true);
    };

    const handleGroupClick = (group) => {
        router.push(`/connections/groups/${group.id}`, {state: {groupName: group.name}});
    };

    const getConnectionCount = (connections) => {
        return connections ? connections.length : 0;
    };

    if (connectionGroupsStore.connectionGroupsLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '200px',
                }}
            >
                <Loading/>
            </Box>
        );
    }

    return (
        <Box sx={{p: 3, maxWidth: 800, mx: 'auto'}}>
            <Box sx={{mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography variant="h4" component="h1" sx={{fontWeight: 'bold'}}>
                    Connection Groups
                </Typography>
                {!isMobile && (
                    <Button
                        variant="contained"
                        startIcon={<Add/>}
                        onClick={() => setCreateDialogOpen(true)}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3,
                        }}
                    >
                        Create Group
                    </Button>
                )}
            </Box>

            <Typography variant="body1" color="textSecondary" sx={{mb: 3}}>
                Organize your connections into groups for better management and organization.
            </Typography>

            <Paper elevation={2} sx={{borderRadius: 2, overflow: 'hidden'}}>
                {connectionGroupsStore.connectionGroups.length === 0 ? (
                    <Box sx={{p: 4, textAlign: 'center'}}>
                        <Group sx={{fontSize: 60, color: 'text.secondary', mb: 2}}/>
                        <Typography variant="h6" color="textSecondary" sx={{mb: 1}}>
                            No connection groups yet
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Create your first group to start organizing your connections.
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {connectionGroupsStore.connectionGroups.map((group, index) => {
                            const connectionCount = getConnectionCount(group.connections);

                            return (
                                <React.Fragment key={group.id}>
                                    <ListItemButton
                                        onClick={() => handleGroupClick(group)}
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                                    <Typography variant="h6" sx={{fontWeight: 500}}>
                                                        {group.name}
                                                    </Typography>
                                                    <Chip
                                                        label={`${connectionCount} connection${connectionCount !== 1 ? 's' : ''}`}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{
                                                            borderColor: theme.palette.primary.main,
                                                            color: theme.palette.primary.main,
                                                            backgroundColor: 'rgba(0, 152, 255, 0.08)',
                                                            fontWeight: 500,
                                                        }}
                                                    />
                                                </Box>
                                            }
                                        />
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={(event) => openDeleteDialog(group, event)}
                                                sx={{
                                                    color: theme.palette.error.main,
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.error.light + '20',
                                                    },
                                                }}
                                            >
                                                <Delete/>
                                            </IconButton>
                                            <ChevronRight sx={{color: 'text.secondary'}}/>
                                        </Box>
                                    </ListItemButton>
                                    {index < connectionGroupsStore.connectionGroups.length - 1 && (
                                        <Box sx={{borderBottom: 1, borderColor: 'divider', mx: 3}}/>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </List>
                )}
            </Paper>

            {/* Mobile FAB */}
            {isMobile && (
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={() => setCreateDialogOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                    }}
                >
                    <Add/>
                </Fab>
            )}

            {/* Create Group Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Create Connection Group</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a name for your new connection group. You can use this to organize your connections.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Group Name"
                        fullWidth
                        variant="outlined"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleCreateGroup();
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateGroup}
                        variant="contained"
                        disabled={!groupName.trim() || connectionGroupsStore.connectionGroupsLoading}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Delete Connection Group</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete "{selectedGroup?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteGroup}
                        variant="contained"
                        color="error"
                        disabled={connectionGroupsStore.connectionGroupsLoading}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}));

export default ConnectionGroups;