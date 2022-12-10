import React from 'react';
import {Menu, MenuItem, Sidebar, useProSidebar} from "react-pro-sidebar";
import {Link} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {router} from "../../router";
import {
    AccountCircle,
    ArrowBack,
    ArrowForward,
    Group,
    HomeOutlined,
    Menu as MenuIcon,
} from "@material-ui/icons";
import {Divider} from "@mui/material";


function Navigation(props) {
    async function logoutAccount(event) {
        event.preventDefault()
        await props.authStore.logout()
        router.push("/")
    }

    const {authStore, connectionsStore} = props
    const {collapsed, collapseSidebar} = useProSidebar();


    return <div style={{display: 'flex', height: '100vh', position: "relative"}}>
        <Sidebar defaultCollapsed={true}>
            <Menu closeOnClick={true}>
                <MenuItem icon={<MenuIcon/>} onClick={() => collapseSidebar(!collapsed)}/>

                <MenuItem routerLink={<Link to="/"/>} icon={<HomeOutlined/>}>Home</MenuItem>

                {authStore.isLoggedIn && <MenuItem routerLink={<Link to={`/account/${authStore.userId}`}/>}
                                                   icon={<AccountCircle/>}>Account</MenuItem>}

                {authStore.isLoggedIn && (
                    connectionsStore.requests.length > 0 ?
                        <MenuItem routerLink={<Link to='/connections'/>} icon={<Group/>}> Connections
                            ({connectionsStore.requests.length})</MenuItem> :
                        <MenuItem routerLink={<Link to='/connections'/>} icon={<Group/>}> Connections </MenuItem>
                )}

                <Divider/>
                {authStore.isLoggedIn ?
                    <MenuItem onClick={(e) => logoutAccount(e)} icon={<ArrowBack/>}>Logout</MenuItem> :
                    <MenuItem routerLink={<Link to='/login'/>} icon={<ArrowForward/>}> Login </MenuItem>
                }
            </Menu>
        </Sidebar>
    </div>;
}

export default inject("authStore", "connectionsStore")(observer(Navigation));
