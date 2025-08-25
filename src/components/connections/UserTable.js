import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    InputAdornment,
    Pagination,
    Paper,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {People, PersonSearch, Search,} from "@mui/icons-material";
import UserCard from "./UserCard";

class UserTable extends Component {
    componentWillUnmount() {
        const {usersStore} = this.props;
        usersStore.setNameFilter("")
    }

    renderLoadingSkeleton = () => (
        <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Skeleton variant="circular" width={48} height={48} />
                                <Stack sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="70%" height={24} />
                                    <Skeleton variant="text" width="50%" height={20} />
                                    <Skeleton variant="rectangular" width={80} height={32} sx={{ mt: 1, borderRadius: 1 }} />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    renderEmptyState = () => {
        const {usersStore} = this.props;

        if (!usersStore.nameFilter || usersStore.nameFilter.length < 3) {
            return (
                <Paper
                    sx={{
                        p: { xs: 4, sm: 6 },
                        textAlign: 'center',
                        backgroundColor: 'background.paper',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'grey.200',
                    }}
                >
                    <PersonSearch sx={{ fontSize: { xs: 48, sm: 64 }, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h5" component="h2" gutterBottom color="text.primary">
                        Find New Connections
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                        Search for people by name to connect with them and expand your network
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Enter at least 3 characters in the search box above to get started
                    </Typography>
                </Paper>
            );
        }

        return (
            <Paper
                sx={{
                    p: { xs: 4, sm: 6 },
                    textAlign: 'center',
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                }}
            >
                <People sx={{ fontSize: { xs: 48, sm: 64 }, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" gutterBottom color="text.primary">
                    No users found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No matches for "{usersStore.nameFilter}"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Try a different name or check the spelling
                </Typography>
            </Paper>
        );
    };

    render() {
        const {usersStore} = this.props;
        const hasResults = usersStore.users && usersStore.users.length > 0;
        const showResults = usersStore.nameFilter && usersStore.nameFilter.length >= 3;

        return (
            <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
                {/* Page Header */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem' } }}
                    >
                        Find New Connections
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Search for people to add to your network
                    </Typography>
                </Box>

                {/* Search Section */}
                <Card sx={{ mb: 4, backgroundColor: 'background.paper' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Search for people"
                                placeholder="Enter a person's name"
                                value={usersStore.nameFilter}
                                onChange={(e) => usersStore.setNameFilter(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'grey.50',
                                        fontSize: { xs: '1rem', sm: '1.1rem' },
                                    },
                                }}
                            />

                            {/* Search Status */}
                            {usersStore.nameFilter && usersStore.nameFilter.length < 3 && (
                                <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                                    Please enter at least 3 characters to search for users
                                </Alert>
                            )}

                            {showResults && hasResults && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Found {usersStore.totalUsers || usersStore.users.length} result{(usersStore.totalUsers || usersStore.users.length) !== 1 ? 's' : ''} for
                                    </Typography>
                                    <Chip
                                        label={`"${usersStore.nameFilter}"`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Box>
                            )}
                        </Stack>
                    </CardContent>
                </Card>

                {/* Results Section */}
                <Box>
                    {/* Loading State */}
                    {usersStore.loading && showResults && this.renderLoadingSkeleton()}

                    {/* Results Grid */}
                    {!usersStore.loading && showResults && hasResults && (
                        <>
                            <Grid container spacing={{ xs: 2, sm: 3 }}>
                                {usersStore.users.map((user, index) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        lg={3}
                                        key={`user-${user.id || index}`}
                                    >
                                        <UserCard user={user} />
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Pagination */}
                            {usersStore.pageCount > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Card sx={{ p: 2 }}>
                                        <Stack spacing={2} alignItems="center">
                                            <Pagination
                                                page={usersStore.page}
                                                count={usersStore.pageCount}
                                                color="primary"
                                                size="large"
                                                siblingCount={1}
                                                boundaryCount={1}
                                                onChange={(e, page) => usersStore.setPage(page)}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                Page {usersStore.page} of {usersStore.pageCount}
                                            </Typography>
                                        </Stack>
                                    </Card>
                                </Box>
                            )}
                        </>
                    )}

                    {/* Empty States */}
                    {!usersStore.loading && !hasResults && this.renderEmptyState()}
                </Box>
            </Container>
        );
    }
}

export default inject("usersStore")(observer(UserTable));