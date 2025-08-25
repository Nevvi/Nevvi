import React, {Component} from 'react';
import {Box, Button, Card, CardContent, Container, Grid, Paper, Typography} from '@mui/material';
import {ArrowBack, People} from '@mui/icons-material';
import {inject, observer} from 'mobx-react';
import {router} from '../../router';
import UserCard from '../connections/UserCard';
import PermissionGroupModal from '../connections/PermissionGroupModal';

class BlockedUsers extends Component {
    render() {
        const { accountStore, usersStore } = this.props;

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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => router.push('/account')}
                            sx={{ mr: 2 }}
                        >
                            Back to Account
                        </Button>
                    </Box>
                    <Typography variant="h4" component="h1">
                        Blocked Users
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage users you have blocked from connecting with you
                    </Typography>
                </Paper>

                {/* Blocked Users Content */}
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Box>
                            {accountStore.rejectedUsers.length === 0 ? (
                                <Card sx={{ textAlign: 'center', py: 6, backgroundColor: '#fafafa' }}>
                                    <CardContent>
                                        <People sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            No Blocked Users
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Users you block will appear here
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Grid container spacing={3}>
                                    {accountStore.rejectedUsers.map((row, index) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={`rejected-user-card-${index}`}>
                                            <UserCard user={row}/>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            <PermissionGroupModal
                                handler={(userId, group) => {
                                    usersStore.requestConnection(userId, group).then(() => {
                                        accountStore.getRejectedUsers()
                                    })
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        );
    }
}

export default inject('accountStore', 'usersStore')(observer(BlockedUsers));