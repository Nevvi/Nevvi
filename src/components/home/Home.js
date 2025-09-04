import React from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    AccountBox,
    Group,
    Security,
    Smartphone,
    ArrowForward,
} from '@mui/icons-material';
import {router} from '../../router';
import Logo from '../utils/Logo';
import {AppStoreButton} from '../authentication/AppStoreButton';

const FeatureCard = ({ icon, title, description }) => (
    <Paper
        elevation={8}
        sx={{
            p: { xs: 3, sm: 4 },
            height: '100%',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 48px rgba(0, 152, 255, 0.2)',
            },
        }}
    >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
                sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0098ff 0%, #162d50 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                }}
            >
                {icon}
            </Box>
            <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                {title}
            </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {description}
        </Typography>
    </Paper>
);

const Home = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
        >
            {/* Hero Section */}
            <Container maxWidth="lg">
                <Box
                    sx={{
                        pt: { xs: 4, sm: 6, md: 8 },
                        pb: { xs: 6, sm: 8, md: 10 },
                        textAlign: 'center',
                        color: 'white',
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <Logo color="white" size={isMobile ? 64 : 80} />
                    </Box>

                    <Typography
                        variant={isMobile ? 'h4' : 'h2'}
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: 'white',
                            fontSize: { xs: '1.75rem', sm: '2.5rem' },
                        }}
                    >
                        Nevvi
                    </Typography>

                    <Typography
                        variant={isMobile ? 'h5' : 'h3'}
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            mb: 3,
                            color: 'rgba(255, 255, 255, 0.95)',
                        }}
                    >
                        Manage Your Own Information,
                        <br />
                        Not Everyone Else's
                    </Typography>

                    <Typography
                        variant={isMobile ? 'h6' : 'h5'}
                        component="h2"
                        sx={{
                            mb: 4,
                            maxWidth: 600,
                            mx: 'auto',
                            fontWeight: 400,
                            color: 'rgba(255, 255, 255, 0.9)',
                            lineHeight: 1.5,
                        }}
                    >
                        Take control of your personal data with smart permission groups
                        and seamless connection management.
                    </Typography>

                    <Stack
                        direction={isMobile ? 'column' : 'row'}
                        spacing={2}
                        sx={{ justifyContent: 'center', mb: 2 }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={() => router.push('/createAccount')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                color: 'white',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.25)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                },
                            }}
                        >
                            Get Started Free
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => router.push('/login')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                color: 'white',
                                '&:hover': {
                                    borderColor: 'white',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            Sign In
                        </Button>
                    </Stack>
                </Box>
            </Container>

            {/* Features Section */}
            <Box
                sx={{
                    background: theme.palette.background.default,
                    py: { xs: 6, sm: 8, md: 10 },
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant={isMobile ? 'h4' : 'h2'} component="h2" gutterBottom>
                            Why Choose Nevvi?
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}
                        >
                            Modern contact management designed around your privacy and control
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<AccountBox sx={{ fontSize: 32, color: 'white' }} />}
                                title="Your Information, Your Control"
                                description="Instead of storing everyone else's constantly changing information, focus on managing your own. Share what you want, when you want, with complete control over your personal data."
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<Security sx={{ fontSize: 32, color: 'white' }} />}
                                title="Smart Permission Groups"
                                description="Create custom permission groups to control exactly what information different people can see. Family sees your home address, work colleagues see your professional info, friends see what you choose."
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<Group sx={{ fontSize: 32, color: 'white' }} />}
                                title="Connection Groups"
                                description="Organize your connections into groups for easy access. Instantly view and manage large groups of people's information - perfect for teams, events, or any group communication."
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* How It Works Section */}
            <Box
                sx={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    py: { xs: 6, sm: 8, md: 10 },
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant={isMobile ? 'h4' : 'h2'}
                            component="h2"
                            gutterBottom
                            sx={{ color: 'white' }}
                        >
                            How It Works
                        </Typography>
                    </Box>

                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={16}
                                sx={{
                                    p: { xs: 3, sm: 4 },
                                    borderRadius: 3,
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                }}
                            >
                                <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                                    Simple. Secure. Smart.
                                </Typography>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="h6" component="h4" gutterBottom>
                                            1. Create Permission Groups
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Set up groups like "Family", "Work", or "Friends" with different access levels to your information.
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" component="h4" gutterBottom>
                                            2. Connect with Others
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Add connections and assign them to permission groups. They'll only see what you allow.
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" component="h4" gutterBottom>
                                            3. Organize Connection Groups
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Create groups of connections for easy access to multiple people's information at once.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Smartphone
                                    sx={{
                                        fontSize: { xs: 120, sm: 160 },
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        mb: 2,
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 400, mb: 3 }}
                                >
                                    Available on mobile and web
                                </Typography>
                                <AppStoreButton
                                    url="https://apps.apple.com/us/app/nevvi/id1669915435"
                                    style={{ margin: '0 auto' }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    py: { xs: 6, sm: 8, md: 10 },
                    background: theme.palette.background.default,
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        elevation={24}
                        sx={{
                            p: { xs: 4, sm: 6 },
                            textAlign: 'center',
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <Typography variant={isMobile ? 'h4' : 'h3'} component="h2" gutterBottom>
                            Ready to Take Control?
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 4, lineHeight: 1.6 }}
                        >
                            Take back control of your personal information.
                            Start managing your own data today.
                        </Typography>
                        <Stack
                            direction={isMobile ? 'column' : 'row'}
                            spacing={2}
                            sx={{ justifyContent: 'center' }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForward />}
                                onClick={() => router.push('/createAccount')}
                                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                            >
                                Create Free Account
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => router.push('/login')}
                                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                            >
                                Sign In
                            </Button>
                        </Stack>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;