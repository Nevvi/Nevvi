import React from 'react';
import { inject, observer } from 'mobx-react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Divider,
    Avatar,
    useTheme,
    useMediaQuery,
    IconButton,
    AppBar,
    Toolbar,
} from '@mui/material';
import {
    People,
    PersonAdd,
    AccountCircle,
    Help,
    Logout,
    Menu as MenuIcon,
    Group,
} from '@mui/icons-material';
import { router } from '../../router';
import Logo from '../utils/Logo';

const Navigation = inject('authStore', 'accountStore')(observer(({ authStore, accountStore }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = React.useState(false);

    if (!authStore.isLoggedIn) {
        return null; // Don't show navigation for unauthenticated users
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navigationItems = [
        {
            text: 'Connections',
            icon: <People />,
            path: '/connections',
            onClick: () => router.push('/connections'),
        },
        {
            text: 'Add Connection',
            icon: <PersonAdd />,
            path: '/connections/new',
            onClick: () => router.push('/connections/new'),
        },
        {
            text: 'Connection Groups',
            icon: <Group />,
            path: '/connections/groups',
            onClick: () => router.push('/connections/groups'),
        },
        {
            text: 'My Account',
            icon: <AccountCircle />,
            path: '/account',
            onClick: () => router.push('/account'),
        },
        {
            text: 'Help',
            icon: <Help />,
            path: '/help',
            onClick: () => router.push('/help'),
        },
    ];

    const drawerWidth = 280;

    const drawer = (
        <Box
            sx={{
                height: '100%',
                background: `linear-gradient(180deg, ${theme.palette.secondary.main} 0%, ${theme.palette.tertiary.main} 100%)`,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden', // Prevent any overflow
                // Hide scrollbar completely
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                'msOverflowStyle': 'none',
                'scrollbarWidth': 'none',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 3,
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Logo color="white" size={40} />
                <Typography
                    variant="h6"
                    sx={{
                        mt: 1,
                        fontWeight: 600,
                        color: 'white',
                    }}
                >
                    Nevvi
                </Typography>
            </Box>

            {/* User Profile Section */}
            <Box
                sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: theme.palette.primary.main,
                        mr: 2,
                    }}
                >
                    {accountStore.user?.firstName?.charAt(0) || 'U'}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            color: 'white',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {accountStore.user?.firstName && accountStore.user?.lastName
                            ? `${accountStore.user.firstName} ${accountStore.user.lastName}`
                            : 'Welcome'}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {accountStore.user?.phoneNumber || 'User'}
                    </Typography>
                </Box>
            </Box>

            {/* Navigation Items */}
            <List sx={{ flexGrow: 1, py: 2 }}>
                {navigationItems.map((item) => {
                    const isActive = router.location.pathname === item.path ||
                        (item.path === '/connections' && router.location.pathname === '/');

                    return (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => {
                                item.onClick();
                                if (isMobile) setMobileOpen(false);
                            }}
                            sx={{
                                mx: 2,
                                mb: 1,
                                borderRadius: 2,
                                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: isActive ? theme.palette.primary.light : 'rgba(255, 255, 255, 0.7)',
                                    minWidth: 40,
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.9)',
                                    '& .MuiListItemText-primary': {
                                        fontWeight: isActive ? 600 : 400,
                                    },
                                }}
                            />
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

            {/* Logout */}
            <ListItem
                button
                onClick={() => {
                    authStore.logout();
                    if (isMobile) setMobileOpen(false);
                }}
                sx={{
                    mx: 2,
                    my: 2,
                    borderRadius: 2,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    },
                }}
            >
                <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', minWidth: 40 }}>
                    <Logout />
                </ListItemIcon>
                <ListItemText
                    primary="Sign Out"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                    }}
                />
            </ListItem>
        </Box>
    );

    return (
        <>
            {/* Mobile App Bar */}
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        width: '100%',
                        background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.tertiary.main} 100%)`,
                        zIndex: theme.zIndex.drawer + 1,
                    }}
                >
                    <Toolbar
            sx={{
              minHeight: '64px !important',
              px: 2,
              justifyContent: 'space-between',
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                p: 1.5,
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Optional: You could add a profile avatar or action button here */}
            <Box sx={{ width: 56 }} /> {/* Spacer to keep title centered */}
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              top: '64px', // Start below the app bar
              height: 'calc(100% - 64px)', // Adjust height to account for app bar
              overflowX: 'hidden', // Prevent horizontal scrolling
              overflowY: 'auto', // Allow vertical scrolling
              // Hide scrollbar but keep functionality
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              'msOverflowStyle': 'none',
              'scrollbarWidth': 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

            {/* Desktop Drawer */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            overflowX: 'hidden', // Prevent horizontal scrolling
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            )}
        </>
    );
}));

export default Navigation;