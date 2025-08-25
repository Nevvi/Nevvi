import React from 'react';
import {Box, useMediaQuery, useTheme} from '@mui/material';
import {inject, observer} from 'mobx-react';
import Navigation from '../navbar/Navigation';

const AppLayout = inject('authStore')(observer(({ children, authStore }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Navigation />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    backgroundColor: theme.palette.background.default,
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    // Only add padding if user is logged in AND on mobile
                    paddingTop: (isMobile && authStore.isLoggedIn) ? '64px' : 0,
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                        p: { xs: 2, sm: 3, md: 4 },
                        maxWidth: '1200px',
                        margin: '0 auto',
                        width: '100%',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}));

export default AppLayout;