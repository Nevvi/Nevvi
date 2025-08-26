import React, {Component} from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {MobileDatePicker} from '@mui/x-date-pickers/MobileDatePicker';
import {Block, Check, ChevronRight, Group} from '@mui/icons-material';
import {inject, observer} from 'mobx-react';
import dayjs from 'dayjs';
import Loading from '../loading/Loading';
import {router} from '../../router';

class Account extends Component {
    constructor(props) {
        super(props);
        this.updateAccount = this.updateAccount.bind(this);
    }

    componentDidMount() {
        const {accountStore} = this.props;
        accountStore.getUser()
    }

    async updateAccount(event) {
        event.preventDefault()
        const {accountStore} = this.props;
        await accountStore.saveUser()
    }

    render() {
        // Initial page load
        const {accountStore, confirmAttributeStore} = this.props;
        const user = accountStore.updatedUser;
        if (!user) {
            return <Loading component={<div/>} loading={accountStore.loading}/>
        }

        // Subsequent page load
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
                    <Typography variant="h4" component="h1">
                        Account Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your profile information and preferences
                    </Typography>
                </Paper>

                {/* Profile Section */}
                <Card sx={{ mb: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                            Profile Information
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Profile Image */}
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <input
                                        accept="image/*"
                                        style={{display: 'none'}}
                                        id="profile-image-button"
                                        type="file"
                                        onChange={(e) => accountStore.saveUserImage(e.target.files[0])}
                                    />
                                    <label htmlFor="profile-image-button">
                                        {accountStore.imageLoading ? (
                                            <Avatar
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    mx: 'auto',
                                                    mb: 2,
                                                    cursor: 'pointer',
                                                    boxShadow: 2,
                                                }}
                                            >
                                                <CircularProgress />
                                            </Avatar>
                                        ) : (
                                            <Avatar
                                                src={user.profileImage}
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    mx: 'auto',
                                                    mb: 2,
                                                    cursor: 'pointer',
                                                    boxShadow: 2,
                                                    transition: 'transform 0.2s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                    }
                                                }}
                                            >
                                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                            </Avatar>
                                        )}
                                    </label>
                                    <Typography variant="h6" gutterBottom fontWeight={600}>
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Click to change profile picture
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Personal Details Form */}
                            <Grid item xs={12} md={8}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                    Personal Details
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="email-input"
                                            label="Email Address"
                                            type="text"
                                            value={user.email}
                                            disabled
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {user.emailConfirmed ? (
                                                            <Check sx={{ color: 'success.main' }} />
                                                        ) : null}
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="phone-input"
                                            label="Phone Number"
                                            type="text"
                                            disabled={user.phoneNumberConfirmed}
                                            value={user.phoneNumber || ""}
                                            onChange={(e) => accountStore.updateUser("phoneNumber", e.target.value)}
                                            InputProps={{
                                                endAdornment: user.phoneNumber ? (
                                                    <InputAdornment position="end">
                                                        {!user.phoneNumberConfirmed ? (
                                                            <LoadingButton
                                                                size="small"
                                                                variant="outlined"
                                                                loading={confirmAttributeStore.loading}
                                                                onClick={() => confirmAttributeStore.sendPhoneConfirmCode()}
                                                            >
                                                                Verify
                                                            </LoadingButton>
                                                        ) : (
                                                            <Check sx={{ color: 'success.main' }} />
                                                        )}
                                                    </InputAdornment>
                                                ) : null
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <MobileDatePicker
                                            label="Date of Birth"
                                            inputFormat="MM/DD/YYYY"
                                            views={["year", "month", "day"]}
                                            value={(user.birthday && dayjs(user.birthday)) || null}
                                            onChange={(birthday) => accountStore.updateUser("birthday", birthday.format("YYYY-MM-DD"))}
                                            renderInput={(params) => (
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    {...params}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="first-name-input"
                                            label="First Name"
                                            type="text"
                                            value={user.firstName || ""}
                                            onChange={(e) => accountStore.updateUser("firstName", e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="last-name-input"
                                            label="Last Name"
                                            type="text"
                                            value={user.lastName || ""}
                                            onChange={(e) => accountStore.updateUser("lastName", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                                    Address Information
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="street-address-input"
                                            label="Street Address"
                                            type="text"
                                            value={(user.address && user.address.street) || ""}
                                            onChange={(e) => accountStore.updateAddress("street", e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="unit-input"
                                            label="Unit/Apt"
                                            type="text"
                                            value={(user.address && user.address.unit) || ""}
                                            onChange={(e) => accountStore.updateAddress("unit", e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="city-input"
                                            label="City"
                                            type="text"
                                            value={(user.address && user.address.city) || ""}
                                            onChange={(e) => accountStore.updateAddress("city", e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="state-input"
                                            label="State/Province"
                                            type="text"
                                            value={(user.address && user.address.state) || ""}
                                            onChange={(e) => accountStore.updateAddress("state", e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="zipCode-input"
                                            label="Zip/Postal Code"
                                            type="text"
                                            inputProps={{maxLength: 5}}
                                            value={(user.address && user.address.zipCode) || ""}
                                            onChange={(e) => accountStore.updateAddress("zipCode", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                    <LoadingButton
                                        size="large"
                                        variant="contained"
                                        loading={accountStore.loading}
                                        disabled={!accountStore.hasUserChanged}
                                        onClick={this.updateAccount}
                                    >
                                        Save Changes
                                    </LoadingButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Quick Access Navigation */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card 
                            sx={{ 
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 4,
                                }
                            }}
                            onClick={() => router.push('/account/permissions')}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Group sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                                        <Box>
                                            <Typography variant="h6" gutterBottom>
                                                Permission Groups
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Control what information different groups can see
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <ChevronRight sx={{ color: 'text.secondary' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card 
                            sx={{ 
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 4,
                                }
                            }}
                            onClick={() => router.push('/account/blocked-users')}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Block sx={{ fontSize: 32, color: 'error.main', mr: 2 }} />
                                        <Box>
                                            <Typography variant="h6" gutterBottom>
                                                Blocked Users
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Manage users you have blocked
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <ChevronRight sx={{ color: 'text.secondary' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Phone Confirmation Dialog */}
                <Dialog
                    open={confirmAttributeStore.waitingConfirmationCode}
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
                        color: 'primary.main'
                    }}>
                        Confirm Phone Number
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 3 }}>
                            {confirmAttributeStore.confirmationCodePrompt}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            fullWidth
                            variant="outlined"
                            label="Confirmation Code"
                            value={confirmAttributeStore.confirmationCode}
                            onChange={(e) => confirmAttributeStore.setConfirmationCode(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => confirmAttributeStore.cancelConfirm()}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={confirmAttributeStore.loading}
                            onClick={() => confirmAttributeStore.confirmPhone()}
                        >
                            Confirm
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Container>
        )
    }
}

export default inject('accountStore', 'confirmAttributeStore')(observer(Account));