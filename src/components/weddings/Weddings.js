import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Button,
    Container,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    ArrowForward,
    AutoAwesome,
    Cancel,
    ExpandMore,
    FormatQuote,
} from '@mui/icons-material';
import { router } from '../../router';
import Logo from '../utils/Logo';
import AppPromotionBanner from '../home/AppPromotionBanner';

const painPoints = [
    'Texting 150 people individually asking for their address',
    'Half of them never respond',
    'Copying addresses into a spreadsheet by hand',
    'Asking again for thank-you cards because someone moved',
];

const steps = [
    {
        title: 'Download the app',
        description: 'Get the Nevvi app from the App Store for the best experience managing your guest list.',
    },
    {
        title: 'Invite your guests',
        description: 'Send a quick text from the app. Guests can join the app and add their address in under 2 minutes.',
    },
    {
        title: 'Track responses',
        description: 'See who\'s added their address and who needs a nudge—all in one dashboard.',
    },
    {
        title: 'Export the data',
        description: 'Download your latest guest addresses as a spreadsheet once everyone has joined.',
    },
];

const faqs = [
    {
        question: 'Is it really free?',
        answer: 'Yes. Nevvi is free for couples and guests. No trial, no premium tier (yet).',
    },
    {
        question: 'Will my guests actually use it?',
        answer: 'The average response rate is over 40%—way higher than a Google Form. And you can remind stragglers with one tap.',
    },
    {
        question: 'What if guests don\'t have iPhones?',
        answer: 'Nevvi works on any phone via web browser. No app download required.',
    },
    {
        question: 'What happens after the wedding?',
        answer: 'Your guests keep their Nevvi profile. When they move, their address stays current—useful for holiday cards, baby showers, or just staying in touch.',
    },
];

const Weddings = () => {
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
                        Collect wedding addresses without the chaos
                    </Typography>

                    <Typography
                        variant={isMobile ? 'h6' : 'h5'}
                        component="h2"
                        sx={{
                            mb: 4,
                            maxWidth: 700,
                            mx: 'auto',
                            fontWeight: 400,
                            color: 'rgba(255, 255, 255, 0.9)',
                            lineHeight: 1.5,
                        }}
                    >
                        Stop chasing guests over text. Nevvi lets you gather addresses in one place—and keeps them updated for save-the-dates, invitations, and thank-yous.
                    </Typography>

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

                    <Typography
                        variant="body2"
                        sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Free for you and your guests. No catch.
                    </Typography>
                </Box>
            </Container>

            {/* Problem Section */}
            <Box
                sx={{
                    background: theme.palette.background.default,
                    py: { xs: 6, sm: 8, md: 10 },
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        variant={isMobile ? 'h4' : 'h3'}
                        component="h2"
                        gutterBottom
                        sx={{ textAlign: 'center', mb: 4 }}
                    >
                        Sound familiar?
                    </Typography>

                    <Paper
                        elevation={8}
                        sx={{
                            p: { xs: 3, sm: 4 },
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <List>
                            {painPoints.map((point, index) => (
                                <ListItem key={index} sx={{ py: 1.5 }}>
                                    <ListItemIcon>
                                        <Cancel sx={{ color: 'error.main' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={point}
                                        primaryTypographyProps={{
                                            variant: 'body1',
                                            color: 'text.secondary',
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    <Typography
                        variant="h5"
                        sx={{
                            textAlign: 'center',
                            mt: 4,
                            fontWeight: 600,
                            color: 'primary.main',
                        }}
                    >
                        There's a better way.
                    </Typography>
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
                    <Typography
                        variant={isMobile ? 'h4' : 'h3'}
                        component="h2"
                        gutterBottom
                        sx={{ textAlign: 'center', mb: 6, color: 'white' }}
                    >
                        How Nevvi works
                    </Typography>

                    <Grid container spacing={4}>
                        {steps.map((step, index) => (
                            <Grid item xs={12} md={3} key={index}>
                                <Paper
                                    elevation={16}
                                    sx={{
                                        p: { xs: 3, sm: 4 },
                                        borderRadius: 3,
                                        height: '100%',
                                        textAlign: 'center',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(20px)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 48px rgba(0, 152, 255, 0.2)',
                                        },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            mx: 'auto',
                                            mb: 2,
                                            background: 'linear-gradient(135deg, #0098ff 0%, #162d50 100%)',
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {index + 1}
                                    </Avatar>
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        gutterBottom
                                        fontWeight={600}
                                    >
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {step.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Magic callout */}
                    <Paper
                        elevation={16}
                        sx={{
                            p: { xs: 3, sm: 4 },
                            mt: 6,
                            borderRadius: 3,
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <AutoAwesome sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            And here's the magic
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            If a guest moves before thank-you cards go out, their address updates automatically. No more returned mail.
                        </Typography>
                    </Paper>
                </Container>
            </Box>

            {/* Social Proof Section */}
            <Box
                sx={{
                    background: theme.palette.background.default,
                    py: { xs: 6, sm: 8 },
                }}
            >
                <Container maxWidth="sm">
                    <Typography
                        variant={isMobile ? 'h4' : 'h3'}
                        component="h2"
                        gutterBottom
                        sx={{ textAlign: 'center', mb: 4 }}
                    >
                        Built for real weddings
                    </Typography>

                    <Paper
                        elevation={8}
                        sx={{
                            p: { xs: 4, sm: 5 },
                            borderRadius: 3,
                            position: 'relative',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <FormatQuote
                            sx={{
                                fontSize: 60,
                                color: 'primary.light',
                                opacity: 0.3,
                                position: 'absolute',
                                top: 16,
                                left: 16,
                            }}
                        />
                        <Typography
                            variant="body1"
                            sx={{
                                fontStyle: 'italic',
                                lineHeight: 1.8,
                                pl: { xs: 2, sm: 4 },
                                pt: 2,
                            }}
                        >
                            "I used Nevvi for my wedding and got most of my addresses without texting a single person. No spreadsheet, no chasing people down."
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 3, pl: { xs: 2, sm: 4 }, fontWeight: 600 }}
                        >
                            — 2025 bride
                        </Typography>
                    </Paper>
                </Container>
            </Box>

            {/* FAQ Section */}
            <Box sx={{ py: { xs: 6, sm: 8 } }}>
                <Container maxWidth="md">
                    <Typography
                        variant={isMobile ? 'h4' : 'h3'}
                        component="h2"
                        gutterBottom
                        sx={{ textAlign: 'center', mb: 4, color: 'white' }}
                    >
                        Questions couples ask
                    </Typography>

                    <Stack spacing={2}>
                        {faqs.map((faq, index) => (
                            <Accordion
                                key={index}
                                elevation={2}
                                sx={{
                                    borderRadius: '12px !important',
                                    '&:before': { display: 'none' },
                                    overflow: 'hidden',
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    sx={{ py: 1 }}
                                >
                                    <Typography variant="h6" fontWeight={600}>
                                        {faq.question}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1" color="text.secondary">
                                        {faq.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Stack>
                </Container>
            </Box>

            {/* Final CTA Section */}
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
                        <Typography
                            variant={isMobile ? 'h4' : 'h3'}
                            component="h2"
                            gutterBottom
                        >
                            Your guest list, handled
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={() => router.push('/createAccount')}
                            sx={{ px: 4, py: 1.5, fontSize: '1.1rem', mt: 3 }}
                        >
                            Start Collecting Addresses
                        </Button>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 2 }}
                        >
                            Takes 2 minutes to set up. Seriously.
                        </Typography>
                    </Paper>
                </Container>
            </Box>

            {/* iOS App Promotion Banner */}
            <AppPromotionBanner />
        </Box>
    );
};

export default Weddings;
