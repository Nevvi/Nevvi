import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";
import {clearTokenHeaders, setTokenHeaders} from "../views/Authentication/Utils";
import axios from "axios";

let ps;

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      return (
        <Route
          path={prop.layout + prop.path}
          component={prop.component}
          key={key}
        />
      );
    })}
    <Redirect from="/" to="/home" />
  </Switch>
);

const useStyles = makeStyles(styles);

export default function Home({ ...rest }) {
  // styles
  const classes = useStyles();

  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();

  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);

  let defaultAuth = localStorage.getItem('Authentication')
  defaultAuth = defaultAuth ? JSON.parse(defaultAuth) : null
  const [authentication, setAuthentication] = React.useState(defaultAuth)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  const logoutAccount = async(event) => {
    event.preventDefault()

    // Remove globally
    try {
      await axios.post(
          `/api/authentication/v1/logout`
      )
    } catch (e) {
      console.log(`ERROR: Failed to log out`, e)
    }

    // Remove locally
    localStorage.removeItem('Authentication')
    setAuthentication(undefined)
    clearTokenHeaders()
  }

  React.useEffect(() => {
    if (authentication) {
      setTokenHeaders(authentication.IdToken, authentication.AccessToken)
    }
  }, [])

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"Nevvi"}
        logo={logo}
        image={bgImage}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        authentication={authentication}
        logoutFunc={logoutAccount}
        color="blue"
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>{switchRoutes}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}