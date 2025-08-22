import React, { Component } from 'react';
import {
    Container,
    Paper,
    Typography,
    Card,
    CardContent,
    Button,
    Box
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { inject, observer } from 'mobx-react';
import PermissionGroups from './PermissionGroups';
import { router } from '../../router';

class PermissionGroupsPage extends Component {
    render() {
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
                        Permission Groups
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Control what information different groups of connections can see about you
                    </Typography>
                </Paper>

                {/* Permission Groups Content */}
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <PermissionGroups />
                    </CardContent>
                </Card>
            </Container>
        );
    }
}

export default inject('accountStore')(observer(PermissionGroupsPage));