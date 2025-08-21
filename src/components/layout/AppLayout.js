
import React from 'react';
import { Box, useTheme } from '@mui/material';
import Navigation from '../navbar/Navigation';

const AppLayout = ({ children }) => {
    const theme = useTheme();

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
};

export default AppLayout;