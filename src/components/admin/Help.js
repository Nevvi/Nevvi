import React, {Component} from 'react';
import {Box, Card, CardContent, Divider, Grid, Link, Paper, Typography} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

class Help extends Component {
    render() {
        return (
            <Box sx={{ padding: 3, maxWidth: 800, margin: '0 auto' }}>
                <Paper elevation={2} sx={{ padding: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <HelpOutlineIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                        <Typography variant="h4" component="h1" color="primary">
                            Help & Support
                        </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Need Assistance?
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Our support team is here to help you with any questions or issues you may have. 
                                We strive to respond to all inquiries promptly and provide the best possible assistance.
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <SupportAgentIcon sx={{ color: 'primary.main', mr: 1 }} />
                                        <Typography variant="h6">
                                            Contact Support
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EmailIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                                        <Typography variant="body1">
                                            Email us at{' '}
                                            <Link 
                                                href="mailto:tyler.cobb@nevvi.net"
                                                sx={{ 
                                                    textDecoration: 'none',
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                            >
                                                tyler.cobb@nevvi.net
                                            </Link>
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                        We typically respond within 24 hours during business days.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                Thank you for using our service. We're committed to providing you with the best experience possible.
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        );
    }
}

export default Help;