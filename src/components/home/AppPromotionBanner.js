import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    Paper,
    Typography,
    Slide,
} from '@mui/material';
import { Close, GetApp } from '@mui/icons-material';

const isIOSDevice = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const AppPromotionBanner = ({ 
    appStoreUrl = "https://apps.apple.com/us/app/nevvi/id1669915435",
    delay = 3000 
}) => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Only show on iOS devices
        if (!isIOSDevice()) {
            return;
        }

        // Check if user has already dismissed the banner
        const bannerDismissed = localStorage.getItem('nevvi-app-banner-dismissed');
        if (bannerDismissed) {
            return;
        }

        // Show banner after delay
        const timer = setTimeout(() => {
            setShowBanner(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem('nevvi-app-banner-dismissed', 'true');
    };

    const handleDownload = () => {
        window.open(appStoreUrl, '_blank', 'noopener,noreferrer');
        handleDismiss(); // Auto-dismiss after clicking download
    };

    if (!showBanner) {
        return null;
    }

    return (
        <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit>
            <Paper
                elevation={16}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    zIndex: 1300,
                    background: 'linear-gradient(135deg, #0098ff 0%, #162d50 100%)',
                    color: 'white',
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ p: 2, pr: 6 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'center' }, 
                        gap: 2
                    }}>
                        {/* Top row on mobile: Icon + Text */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            flex: { sm: 1 },
                            minWidth: 0,
                            justifyContent: { xs: 'center', sm: 'flex-start' }
                        }}>
                            {/* App Icon */}
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 1.5,
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                </svg>
                            </Box>

                            {/* Content */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        fontWeight: 600, 
                                        mb: 0.5,
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    Get the Nevvi App
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        opacity: 0.9,
                                        fontSize: '0.8rem',
                                        lineHeight: 1.2
                                    }}
                                >
                                    Faster, smoother experience
                                </Typography>
                            </Box>
                        </Box>

                        {/* Download Button - separate row on mobile */}
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<GetApp />}
                            onClick={handleDownload}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                fontSize: '0.75rem',
                                px: 2,
                                py: 0.5,
                                flexShrink: 0,
                                minWidth: { xs: 120, sm: 'auto' },
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                                },
                            }}
                        >
                            Download
                        </Button>
                    </Box>
                </Box>

                {/* Close Button */}
                <IconButton
                    size="small"
                    onClick={handleDismiss}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                            color: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                        },
                    }}
                >
                    <Close fontSize="small" />
                </IconButton>
            </Paper>
        </Slide>
    );
};

export default AppPromotionBanner;