import React from 'react';
import {Box, Container, Paper, useMediaQuery, useTheme} from '@mui/material';
import Logo from '../utils/Logo';

const AuthLayout = ({ children, maxWidth = 'sm' }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        py: 2,
                        px: 2,
                        textAlign: 'center',
                        color: 'white',
                    }}
                >
                    <Logo color="white" size={36} />
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        p: 3,
                    }}
                >
                    {children}
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 3,
                px: 2,
            }}
        >
            <Container component="main" maxWidth={maxWidth}>
                <Paper
                    elevation={24}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <Box
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            py: 4,
                            px: 3,
                            textAlign: 'center',
                            color: 'white',
                        }}
                    >
                        <Logo color="white" size={80} />
                    </Box>

                    <Box sx={{ p: { sm: 4, md: 5 } }}>
                        {children}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AuthLayout;