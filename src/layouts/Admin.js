import React from "react";
import WindowFocusHandler from "../assets/focusTab";

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

let ps;

function UserGreeting(props) {
  return <WindowFocusHandler />;
}

function GuestGreeting(props) {
  let enteredName = prompt("password");
  console.log("FILIP")
  sessionStorage.setItem("password", enteredName);
  sessionStorage.setItem("date", Date.now());

  while (
    sessionStorage.getItem("password") !== process.env.REACT_APP_PASSWORD
  ) {
    enteredName = prompt("password");
    sessionStorage.setItem("password", enteredName);
    sessionStorage.setItem("date", Date.now());
  }

  console.log(sessionStorage.getItem("password"));

  return <h1>Please sign up.</h1>;
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;

  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

const useStyles = makeStyles(styles);

export default function Admin() {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [LoggedIn, setLoggedIn] = React.useState(
    sessionStorage.getItem("password") === process.env.REACT_APP_PASSWORD
  );

  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    setLoggedIn(
      sessionStorage.getItem("password") === process.env.REACT_APP_PASSWORD
    );
  }, [LoggedIn]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.mainPanel} ref={mainPanel}>
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        <div>
          <Greeting isLoggedIn={LoggedIn} />
        </div>
      </div>
    </div>
  );
}
