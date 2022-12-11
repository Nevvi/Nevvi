import React from 'react';
import {Menu, MenuItem, Sidebar, useProSidebar} from "react-pro-sidebar";
import {inject, observer} from "mobx-react";
import {router} from "../../router";
import {Divider, IconButton} from "@mui/material";
import {AccountCircle, Group, Home, Login, Logout, Menu as MenuIcon} from "@mui/icons-material";


function Navigation(props) {
    async function logoutAccount(event) {
        event.preventDefault()
        await props.authStore.logout()
        router.push("/")
    }

    const {authStore, connectionsStore} = props
    const {collapsed, collapseSidebar, broken} = useProSidebar();
    const [mobileToggled, setMobileToggled] = React.useState(false)

    const sidebarLeft = mobileToggled || !broken ? '0' : '-250px'
    const sidebarBg = mobileToggled ? 'rgb(249, 249, 249, 1.0)' : 'rgb(249, 249, 249, 0.7)'

    function handleRoute(route) {
        router.push(route)
        setMobileToggled(false)
    }

    return <div className={"menu-container"} >
        <IconButton className={"mobile-menu"} onClick={() => {
            setMobileToggled(!mobileToggled)
            collapseSidebar(false)
        }}>
            <MenuIcon/>
        </IconButton>

        <Sidebar defaultCollapsed={false} breakPoint={"sm"} style={{left: sidebarLeft, backgroundColor: sidebarBg}}>
            <Menu closeOnClick={true}>
                {!broken && <MenuItem icon={<MenuIcon/>} onClick={() => collapseSidebar(!collapsed)}/> }

                <MenuItem onClick={() => handleRoute("/")} icon={<Home/>}>Home</MenuItem>

                {authStore.isLoggedIn && <MenuItem onClick={() => handleRoute(`/account/${authStore.userId}`)}
                                                   icon={<AccountCircle/>}>Account</MenuItem>}

                {authStore.isLoggedIn && (
                    connectionsStore.requests.length > 0 ?
                        <MenuItem onClick={() => handleRoute('/connections')} icon={<Group/>}> Connections
                            ({connectionsStore.requests.length})</MenuItem> :
                        <MenuItem onClick={() => handleRoute('/connections')} icon={<Group/>}> Connections </MenuItem>
                )}

                <Divider/>
                {authStore.isLoggedIn ?
                    <MenuItem onClick={(e) => logoutAccount(e)} icon={<Logout/>}>Logout</MenuItem> :
                    <MenuItem onClick={() => handleRoute('/login')} icon={<Login/>}> Login </MenuItem>
                }
            </Menu>
        </Sidebar>
    </div>;
}

export default inject("authStore", "connectionsStore")(observer(Navigation));
