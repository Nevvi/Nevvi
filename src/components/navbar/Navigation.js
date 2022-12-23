import React from 'react';
import {Menu, MenuItem, Sidebar, SubMenu, useProSidebar} from "react-pro-sidebar";
import {inject, observer} from "mobx-react";
import {router} from "../../router";
import {Button, Divider, IconButton, styled, useTheme} from "@mui/material";
import {AccountCircle, Group, Home, Login, Logout, Menu as MenuIcon, Person} from "@mui/icons-material";

const MenuContainer = styled('div')(({theme}) => ({
    [theme.breakpoints.up('sm')]: {
        display: "flex",
        height: "100vh",
        position: "relative"
    },
    [theme.breakpoints.down('sm')]: {
        display: "flex",
        height: "3rem",
        width: "100%",
        position: "relative",
        justifyContent: "space-between"
    },
    backgroundColor: theme.palette.primary.main,
}));

const MobileMenuTitle = styled(Button)(({theme}) => ({
    [theme.breakpoints.up('sm')]: {
        display: "none",
    },
    color: theme.palette.primary.contrastText
}));

const MobileMenuButton = styled(IconButton)(({theme}) => ({
    [theme.breakpoints.up('sm')]: {
        display: "none",
    },
    color: theme.palette.primary.contrastText
}));

const StyledMenuItem = styled(MenuItem)(({theme}) => ({
    "a:hover": {
        backgroundColor: theme.palette.primary.light
    },
}))

const StyledSubMenu = styled(SubMenu)(({theme}) => ({
    backgroundColor: theme.palette.primary.main,
    "a:hover": {
        backgroundColor: theme.palette.primary.light
    },
    ".ps-submenu-content": {
        backgroundColor: theme.palette.primary.main
    }
}))

function Navigation(props) {
    async function logoutAccount(event) {
        event.preventDefault()
        await props.authStore.logout()
        router.push("/")
    }

    const theme = useTheme()
    const {authStore} = props
    const {collapsed, collapseSidebar, broken} = useProSidebar();
    const [mobileToggled, setMobileToggled] = React.useState(false)

    const sidebarLeft = mobileToggled || !broken ? '0' : '-250px'

    function handleRoute(route) {
        router.push(route)
        setMobileToggled(false)
    }

    return <MenuContainer>
        <MobileMenuTitle onClick={() => {handleRoute("/")}}>
            Nevvi
        </MobileMenuTitle>
        <MobileMenuButton onClick={() => {
            setMobileToggled(!mobileToggled)
            collapseSidebar(false)
        }}>
            <MenuIcon/>
        </MobileMenuButton>

        <Sidebar
            defaultCollapsed={false}
            breakPoint={"sm"}
            style={{
                left: sidebarLeft,
                color: theme.palette.primary.contrastText
            }}
            backgroundColor={theme.palette.primary.main}
        >
            <Menu closeOnClick={true}>
                {!broken && <div>
                    <StyledMenuItem icon={<MenuIcon/>} onClick={() => collapseSidebar(!collapsed)}/>
                    <Divider/>
                </div>}

                <StyledMenuItem onClick={() => handleRoute("/")} icon={<Home/>}>Home</StyledMenuItem>

                <Divider/>

                {authStore.isLoggedIn &&
                    <StyledSubMenu label="Account" icon={<AccountCircle/>} defaultOpen={true}>
                        <Divider/>

                        <StyledMenuItem
                            onClick={() => handleRoute(`/account/${authStore.userId}`)}
                            icon={<Person/>}
                        >
                            Personal Info
                        </StyledMenuItem>

                        <Divider/>

                        <StyledMenuItem
                            onClick={() => handleRoute(`/account/${authStore.userId}/permission-groups`)}
                            icon={<Group/>}
                        >
                            Permission Groups
                        </StyledMenuItem>
                    </StyledSubMenu>
                }

                <Divider/>

                {authStore.isLoggedIn ?
                    <StyledMenuItem onClick={(e) => logoutAccount(e)} icon={<Logout/>}>Logout</StyledMenuItem> :
                    <StyledMenuItem onClick={() => handleRoute('/login')} icon={<Login/>}> Login </StyledMenuItem>
                }
            </Menu>
        </Sidebar>
    </MenuContainer>;
}

export default inject("authStore")(observer(Navigation));
