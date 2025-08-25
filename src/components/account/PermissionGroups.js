import React, {Component} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {Add, ArrowBack, Delete, Edit, Group, Lock, Security} from '@mui/icons-material';
import {inject, observer} from 'mobx-react';
import Loading from '../loading/Loading';
import {router} from "../../router";

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
        const {permissionGroupStore} = this.props;

        if (e.target.checked) {
            permissionGroupStore.addField(field)
        } else {
            permissionGroupStore.removeField(field)
        }
    }

    isSystemGroup(groupName) {
        return groupName === 'All Info';
    }

    render() {
        // Initial page load
        const {accountStore, permissionGroupStore} = this.props;
        const user = accountStore.user;

        if (!user) {
            return <Loading component={<div/>} loading={accountStore.loading}/>
        }

        const hasGroups = user.permissionGroups && user.permissionGroups.length > 0;

        // Mobile card component
        const MobileGroupCard = ({group, isSystem}) => (
            <Card
                sx={{
                    mb: 2,
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                        boxShadow: 2,
                        borderColor: 'primary.main'
                    }
                }}
            >
                <CardContent sx={{pb: 2}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2}}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Group fontSize="small" color="primary"/>
                            <Typography variant="h6" fontWeight={600}>
                                {group.name}
                            </Typography>
                            {isSystem && (
                                <Tooltip title="System group - cannot be modified">
                                    <Lock fontSize="small" sx={{color: 'text.secondary'}}/>
                                </Tooltip>
                            )}
                        </Stack>

                        {!isSystem && (
                            <Stack direction="row" spacing={0.5}>
                                <Tooltip title="Edit Group">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => permissionGroupStore.editGroup(group)}
                                    >
                                        <Edit fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Group">
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => permissionGroupStore.openDeleteConfirm(group)}
                                    >
                                        <Delete fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                        Shared Information:
                    </Typography>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
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
                    </Box>
                </CardContent>
            </Card>
        );

        return (
            <Container maxWidth="lg" sx={{py: {xs: 1, sm: 3}}}>
                {/* Header */}
                <Paper
                    elevation={0}
                    sx={{
                        p: {xs: 1.5, sm: 2},
                        mb: {xs: 2, sm: 3},
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                    }}
                >
                    <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                        <Button
                            startIcon={<ArrowBack/>}
                            onClick={() => router.push('/account')}
                            sx={{mr: 2}}
                        >
                            Back to Account
                        </Button>
                    </Box>
                    <Typography variant="h4" component="h1">
                        Permission Groups
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Control what information different groups of connections can see about you
                    </Typography>
                </Paper>

                {/* Permission Groups Content */}
                <Card>
                    <CardContent sx={{p: 3}}>
                        <Box>
                            {!hasGroups ? (
                                // Empty State (unchanged)
                                <Card sx={{textAlign: 'center', py: 6}}>
                                    <CardContent>
                                        <Security sx={{fontSize: 48, color: 'text.secondary', mb: 2}}/>
                                        <Typography variant="h6" gutterBottom>
                                            No Permission Groups Created
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                                            Create permission groups to control what information different connections
                                            can see
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<Add/>}
                                            onClick={() => permissionGroupStore.setPermissionGroupPromptOpen(true)}
                                            size="large"
                                        >
                                            Create Your First Group
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 3
                                    }}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.permissionGroups.length} permission
                                                group{user.permissionGroups.length !== 1 ? 's' : ''}
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            startIcon={<Add/>}
                                            onClick={() => permissionGroupStore.setPermissionGroupPromptOpen(true)}
                                            sx={{
                                                // Responsive button text
                                                '& .MuiButton-startIcon': {
                                                    mr: {xs: 0, sm: 1}
                                                },
                                                '& .button-text': {
                                                    display: {xs: 'none', sm: 'inline'}
                                                }
                                            }}
                                        >
                                            <span className="button-text">New Group</span>
                                            <Box sx={{display: {xs: 'inline', sm: 'none'}}}>New</Box>
                                        </Button>
                                    </Box>

                                    {/* Mobile Card Layout - visible only on mobile */}
                                    <Box sx={{display: {xs: 'block', md: 'none'}}}>
                                        {user.permissionGroups.map((group, index) => {
                                            const isSystem = this.isSystemGroup(group.name);
                                            return (
                                                <MobileGroupCard
                                                    key={group.name}
                                                    group={group}
                                                    isSystem={isSystem}
                                                />
                                            );
                                        })}
                                    </Box>

                                    {/* Desktop Table Layout - visible only on desktop */}
                                    <TableContainer
                                        component={Paper}
                                        elevation={0}
                                        sx={{
                                            display: {xs: 'none', md: 'block'},
                                            border: '1px solid rgba(0, 0, 0, 0.05)',
                                            borderRadius: 2,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{backgroundColor: '#fafafa'}}>
                                                    <TableCell sx={{fontWeight: 600, color: 'text.primary'}}>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <Group fontSize="small"/>
                                                            <span>Group Name</span>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell sx={{fontWeight: 600, color: 'text.primary'}}>
                                                        Shared Information
                                                    </TableCell>
                                                    <TableCell align="center"
                                                               sx={{fontWeight: 600, color: 'text.primary'}}>
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
                                                                '&:last-child td, &:last-child th': {border: 0},
                                                                '&:hover': {backgroundColor: 'rgba(0, 152, 255, 0.04)'}
                                                            }}
                                                        >
                                                            <TableCell>
                                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                                    <Typography variant="body1" fontWeight={500}>
                                                                        {group.name}
                                                                    </Typography>
                                                                    {isSystem && (
                                                                        <Tooltip
                                                                            title="System group - cannot be modified">
                                                                            <Lock fontSize="small"
                                                                                  sx={{color: 'text.secondary'}}/>
                                                                        </Tooltip>
                                                                    )}
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={1} flexWrap="wrap"
                                                                       useFlexGap>
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
                                                                    <Typography variant="body2" color="text.secondary"
                                                                                fontStyle="italic">
                                                                        System group
                                                                    </Typography>
                                                                ) : (
                                                                    <Stack direction="row" spacing={1}
                                                                           justifyContent="center">
                                                                        <Tooltip title="Edit Group">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => permissionGroupStore.editGroup(group)}
                                                                                sx={{
                                                                                    color: 'primary.main',
                                                                                    '&:hover': {
                                                                                        backgroundColor: 'rgba(0, 152, 255, 0.08)'
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <Edit fontSize="small"/>
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Delete Group">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => permissionGroupStore.openDeleteConfirm(group)}
                                                                                sx={{
                                                                                    color: 'error.main',
                                                                                    '&:hover': {
                                                                                        backgroundColor: 'rgba(244, 67, 54, 0.08)'
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <Delete fontSize="small"/>
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

                            {/* Create New Group Dialog - unchanged */}
                            <Dialog
                                open={permissionGroupStore.permissionGroupPromptOpen}
                                onClose={() => permissionGroupStore.setPermissionGroupPromptOpen(false)}
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
                                    {permissionGroupStore.modalTitle}
                                </DialogTitle>
                                <DialogContent sx={{pt: 2}}>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                                        Choose what information members of this group can see about you.
                                    </Typography>

                                    <TextField
                                        autoFocus
                                        required
                                        fullWidth
                                        variant="outlined"
                                        label="Group Name"
                                        placeholder="e.g., Close Friends, Family, Colleagues"
                                        error={permissionGroupStore.errorText !== ""}
                                        helperText={permissionGroupStore.errorText || "Give your group a descriptive name"}
                                        value={permissionGroupStore.groupName}
                                        onChange={(e) => permissionGroupStore.setGroupName(e.target.value)}
                                        sx={{mb: 3}}
                                    />

                                    <Typography variant="body1" fontWeight={500} sx={{mb: 2}}>
                                        Information to Share
                                    </Typography>

                                    <Box sx={{
                                        p: 2,
                                        backgroundColor: '#fafafa',
                                        borderRadius: 2,
                                        border: '1px solid rgba(0, 0, 0, 0.05)'
                                    }}>
                                        <FormGroup>
                                            <Box sx={{mb: 2}}>
                                                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                                    Always Shared (Required)
                                                </Typography>
                                                <FormControlLabel
                                                    disabled
                                                    checked
                                                    control={<Checkbox sx={{py: 0.5}}/>}
                                                    label={
                                                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                                            First Name
                                                        </Typography>
                                                    }
                                                    sx={{alignItems: 'center', mb: 0.5}}
                                                />
                                                <FormControlLabel
                                                    disabled
                                                    checked
                                                    control={<Checkbox sx={{py: 0.5}}/>}
                                                    label={
                                                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                                            Last Name
                                                        </Typography>
                                                    }
                                                    sx={{alignItems: 'center', mb: 0.5}}
                                                />
                                                <FormControlLabel
                                                    disabled
                                                    checked
                                                    control={<Checkbox sx={{py: 0.5}}/>}
                                                    label={
                                                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                                            Profile Picture
                                                        </Typography>
                                                    }
                                                    sx={{alignItems: 'center'}}
                                                />
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                                Optional Information
                                            </Typography>
                                            <FormControlLabel
                                                onChange={(e) => this.handleCheckboxUpdate(e, "email")}
                                                control={<Checkbox
                                                    checked={permissionGroupStore.fields.includes('email')}
                                                    sx={{py: 0.5}}/>}
                                                label="Email Address"
                                                sx={{alignItems: 'center', mb: 0.5}}
                                            />
                                            <FormControlLabel
                                                onChange={(e) => this.handleCheckboxUpdate(e, "phoneNumber")}
                                                control={<Checkbox
                                                    checked={permissionGroupStore.fields.includes('phoneNumber')}
                                                    sx={{py: 0.5}}/>}
                                                label="Phone Number"
                                                sx={{alignItems: 'center', mb: 0.5}}
                                            />
                                            <FormControlLabel
                                                onChange={(e) => this.handleCheckboxUpdate(e, "address")}
                                                control={<Checkbox
                                                    checked={permissionGroupStore.fields.includes('address')}
                                                    sx={{py: 0.5}}/>}
                                                label="Home Address"
                                                sx={{alignItems: 'center', mb: 0.5}}
                                            />
                                            <FormControlLabel
                                                onChange={(e) => this.handleCheckboxUpdate(e, "birthday")}
                                                control={<Checkbox
                                                    checked={permissionGroupStore.fields.includes('birthday')}
                                                    sx={{py: 0.5}}/>}
                                                label="Date of Birth"
                                                sx={{alignItems: 'center'}}
                                            />
                                        </FormGroup>
                                    </Box>
                                </DialogContent>
                                <DialogActions sx={{p: 3, pt: 1}}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => permissionGroupStore.closeModal()}
                                    >
                                        Cancel
                                    </Button>
                                    <LoadingButton
                                        variant="contained"
                                        loading={permissionGroupStore.loading}
                                        onClick={() => permissionGroupStore.saveGroup()}
                                        disabled={!permissionGroupStore.groupName.trim()}
                                    >
                                        {permissionGroupStore.saveButtonText}
                                    </LoadingButton>
                                </DialogActions>
                            </Dialog>

                            {/* Delete Confirmation Dialog */}
                            <Dialog
                                open={permissionGroupStore.deleteConfirmOpen}
                                onClose={() => permissionGroupStore.closeDeleteConfirm()}
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
                                    color: 'error.main',
                                    pb: 1
                                }}>
                                    Delete Permission Group
                                </DialogTitle>
                                <DialogContent sx={{pt: 2}}>
                                    <Typography variant="body1" sx={{mb: 2}}>
                                        Are you sure you want to delete the
                                        "<strong>{permissionGroupStore.deletingGroup?.name}</strong>" permission group?
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        This action cannot be undone. Any connections currently using this permission
                                        group will be moved to the default "All Info" group.
                                    </Typography>
                                </DialogContent>
                                <DialogActions sx={{p: 3, pt: 1}}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => permissionGroupStore.closeDeleteConfirm()}
                                    >
                                        Cancel
                                    </Button>
                                    <LoadingButton
                                        variant="contained"
                                        color="error"
                                        loading={permissionGroupStore.loading}
                                        onClick={() => permissionGroupStore.deleteGroup()}
                                    >
                                        Delete Group
                                    </LoadingButton>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        )
    }
}

export default inject('accountStore', 'permissionGroupStore')(observer(PermissionGroups));