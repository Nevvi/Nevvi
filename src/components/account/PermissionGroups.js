
import React, { Component } from 'react';
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    Card,
    CardContent
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Add, Group, Edit, Delete, Security, Lock } from '@mui/icons-material';
import { inject, observer } from 'mobx-react';
import Loading from '../loading/Loading';

class PermissionGroups extends Component {
    constructor(props) {
        super(props);
        this.updateAccount = this.updateAccount.bind(this);
    }

    async updateAccount(event) {
        event.preventDefault()
        const {accountStore} = this.props;
        await accountStore.saveUser()
    }

    handleCheckboxUpdate(e, field) {
        const {createPermissionGroupStore} = this.props;

        if (e.target.checked) {
            createPermissionGroupStore.addField(field)
        } else {
            createPermissionGroupStore.removeField(field)
        }
    }

    isSystemGroup(groupName) {
        return groupName === 'All Info';
    }

    render() {
        // Initial page load
        const {accountStore, createPermissionGroupStore} = this.props;
        const user = accountStore.user;
        if (!user) {
            return <Loading component={<div/>} loading={accountStore.loading}/>
        }

        const hasGroups = user.permissionGroups && user.permissionGroups.length > 0;

        return (
            <Box>
                {!hasGroups ? (
                    // Empty State
                    <Card sx={{ textAlign: 'center', py: 6 }}>
                        <CardContent>
                            <Security sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                No Permission Groups Created
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Create permission groups to control what information different connections can see
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => createPermissionGroupStore.setPermissionGroupPromptOpen(true)}
                                size="large"
                            >
                                Create Your First Group
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    // Table with Groups
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    {user.permissionGroups.length} permission group{user.permissionGroups.length !== 1 ? 's' : ''}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => createPermissionGroupStore.setPermissionGroupPromptOpen(true)}
                            >
                                New Group
                            </Button>
                        </Box>

                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                                borderRadius: 2,
                                overflow: 'hidden'
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#fafafa' }}>
                                        <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Group fontSize="small" />
                                                <span>Group Name</span>
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                                            Shared Information
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {user.permissionGroups.map((group, index) => {
                                        const isSystem = this.isSystemGroup(group.name);
                                        return (
                                            <TableRow
                                                key={group.name}
                                                sx={{ 
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    '&:hover': { backgroundColor: 'rgba(0, 152, 255, 0.04)' }
                                                }}
                                            >
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {group.name}
                                                        </Typography>
                                                        {isSystem && (
                                                            <Tooltip title="System group - cannot be modified">
                                                                <Lock fontSize="small" sx={{ color: 'text.secondary' }} />
                                                            </Tooltip>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                        {group.fields.map((field, fieldIndex) => (
                                                            <Chip
                                                                key={fieldIndex}
                                                                label={field}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{
                                                                    borderColor: isSystem ? 'grey.400' : 'primary.main',
                                                                    color: isSystem ? 'text.secondary' : 'primary.main',
                                                                    backgroundColor: isSystem ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 152, 255, 0.08)',
                                                                    fontWeight: 500,
                                                                }}
                                                            />
                                                        ))}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {isSystem ? (
                                                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                            System group
                                                        </Typography>
                                                    ) : (
                                                        <Stack direction="row" spacing={1} justifyContent="center">
                                                            <Tooltip title="Edit Group">
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{
                                                                        color: 'primary.main',
                                                                        '&:hover': {
                                                                            backgroundColor: 'rgba(0, 152, 255, 0.08)'
                                                                        }
                                                                    }}
                                                                >
                                                                    <Edit fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete Group">
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{
                                                                        color: 'error.main',
                                                                        '&:hover': {
                                                                            backgroundColor: 'rgba(244, 67, 54, 0.08)'
                                                                        }
                                                                    }}
                                                                >
                                                                    <Delete fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}

                {/* Create New Group Dialog */}
                <Dialog
                    open={createPermissionGroupStore.permissionGroupPromptOpen}
                    onClose={() => createPermissionGroupStore.setPermissionGroupPromptOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                        }
                    }}
                >
                    <DialogTitle sx={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: 'primary.main',
                        pb: 1
                    }}>
                        Create New Permission Group
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Choose what information members of this group can see about you.
                        </Typography>
                        
                        <TextField
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            label="Group Name"
                            placeholder="e.g., Close Friends, Family, Colleagues"
                            error={createPermissionGroupStore.errorText !== ""}
                            helperText={createPermissionGroupStore.errorText || "Give your group a descriptive name"}
                            value={createPermissionGroupStore.groupName}
                            onChange={(e) => createPermissionGroupStore.setGroupName(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
                            Information to Share
                        </Typography>
                        
                        <Box sx={{ 
                            p: 2, 
                            backgroundColor: '#fafafa', 
                            borderRadius: 2,
                            border: '1px solid rgba(0, 0, 0, 0.05)'
                        }}>
                            <FormGroup>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Always Shared (Required)
                                    </Typography>
                                    <FormControlLabel 
                                        disabled 
                                        checked 
                                        control={<Checkbox sx={{ py: 0.5 }} />} 
                                        label={
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                First Name
                                            </Typography>
                                        }
                                        sx={{ alignItems: 'center', mb: 0.5 }}
                                    />
                                    <FormControlLabel 
                                        disabled 
                                        checked 
                                        control={<Checkbox sx={{ py: 0.5 }} />} 
                                        label={
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Last Name
                                            </Typography>
                                        }
                                        sx={{ alignItems: 'center', mb: 0.5 }}
                                    />
                                    <FormControlLabel 
                                        disabled 
                                        checked 
                                        control={<Checkbox sx={{ py: 0.5 }} />} 
                                        label={
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Profile Picture
                                            </Typography>
                                        }
                                        sx={{ alignItems: 'center' }}
                                    />
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Optional Information
                                </Typography>
                                <FormControlLabel 
                                    onChange={(e) => this.handleCheckboxUpdate(e, "email")}
                                    control={<Checkbox sx={{ py: 0.5 }} />} 
                                    label="Email Address"
                                    sx={{ alignItems: 'center', mb: 0.5 }}
                                />
                                <FormControlLabel 
                                    onChange={(e) => this.handleCheckboxUpdate(e, "phoneNumber")}
                                    control={<Checkbox sx={{ py: 0.5 }} />} 
                                    label="Phone Number"
                                    sx={{ alignItems: 'center', mb: 0.5 }}
                                />
                                <FormControlLabel 
                                    onChange={(e) => this.handleCheckboxUpdate(e, "address")}
                                    control={<Checkbox sx={{ py: 0.5 }} />} 
                                    label="Home Address"
                                    sx={{ alignItems: 'center', mb: 0.5 }}
                                />
                                <FormControlLabel 
                                    onChange={(e) => this.handleCheckboxUpdate(e, "birthday")}
                                    control={<Checkbox sx={{ py: 0.5 }} />} 
                                    label="Date of Birth"
                                    sx={{ alignItems: 'center' }}
                                />
                            </FormGroup>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, pt: 1 }}>
                        <Button 
                            variant="outlined" 
                            onClick={() => createPermissionGroupStore.setPermissionGroupPromptOpen(false)}
                        >
                            Cancel
                        </Button>
                        <LoadingButton 
                            variant="contained" 
                            loading={createPermissionGroupStore.loading}
                            onClick={() => createPermissionGroupStore.saveGroup()}
                            disabled={!createPermissionGroupStore.groupName.trim()}
                        >
                            Create Group
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Box>
        )
    }
}

export default inject('accountStore', 'createPermissionGroupStore')(observer(PermissionGroups));