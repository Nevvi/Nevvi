
import React, { Component } from 'react';
import {
    Grid,
    Typography,
    Card,
    CardContent,
    Box
} from '@mui/material';
import { People } from '@mui/icons-material';
import UserCard from '../connections/UserCard';
import PermissionGroupModal from '../connections/PermissionGroupModal';

class BlockedUsers extends Component {
    render() {
        const { accountStore, usersStore } = this.props;

        return (
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
        );
    }
}

export default BlockedUsers;