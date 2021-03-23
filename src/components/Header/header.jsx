import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import { IconButton, Fab, Card, Chip } from "@material-ui/core";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setGlobalTheme } from "../../Redux/Action/action";
import styles from "./header.module.scss";
import { auth } from "../../firebase";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import cx from "classnames";

//Profile pic Icon
import PersonIcon from "@material-ui/icons/Person";

//Theme Icons
import DarkThemeIcon from "@material-ui/icons/NightsStay";
import LightThemeIcon from "@material-ui/icons/WbSunny";
import RemixThemeIcon from "@material-ui/icons/FilterVintage";
//Report Icons
import BugReportIcon from "@material-ui/icons/BugReport";
import IdeasIcon from "@material-ui/icons/EmojiObjects";
import IssuesIcon from "@material-ui/icons/Warning";
//Social Icons
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";

//logo
import UploraLogo from "./uplora.webp";
import BMClogo from "./bmc-button.png";
function Header(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.CONFIG.userInfo);
  const [open, setOpen] = useState(false);
  const [Theme, setTheme] = useState("dark");

  const handleSignOut = () => {
    auth.signOut();
    history.push("/");
  };
  useEffect(() => {
    function checkingTheme() {
      const currentTheme = localStorage.getItem("Uplora_Theme");
      if (currentTheme) {
        setTheme(currentTheme);
        dispatch(setGlobalTheme(currentTheme));
      }
    }

    checkingTheme();

    return checkingTheme();
  }, []);

  const handleToggleTheme = (e) => {
    setTheme(e);
    dispatch(setGlobalTheme(e));
    localStorage.setItem("Uplora_Theme", e);
  };
  const toggleDrawer = (anchor, e) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(e);
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar color='inherit'>
        <Toolbar className={styles.toolbar}>
          <div style={{ cursor: "pointer" }}>
            <img
              src={UploraLogo}
              style={{ height: "34px" }}
              alt='uplora'
              onClick={() => history.push("/home")}
            />
            <span className={styles.header}>Uplora</span>
          </div>

          <IconButton aria-label='menu toggle' onClick={() => setOpen(!open)}>
            <Fab size='small' color='default' aria-label=''>
              {user && user.photoURL ? (
                <img
                  className={styles.displayPic}
                  src={user.photoURL}
                  alt='display pic'
                />
              ) : (
                <PersonIcon style={{ height: "40px" }} />
              )}
            </Fab>
          </IconButton>
        </Toolbar>
        <SwipeableDrawer
          anchor={"left"}
          open={open}
          onClose={toggleDrawer("left", false)}
          onOpen={toggleDrawer("left", true)}
          transitionDuration={600}
        >
          <div style={{ width: "100vw", height: "100vh" }}>
            {user && (
              <List>
                <ListItem>
                  <IconButton
                    aria-label='drawer closing button'
                    onClick={() => setOpen(!open)}
                    style={{ float: "right", position: "relative" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </ListItem>
                <ListItem className={styles.list_Item}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "7px",
                      alignItems: "center",
                      padding: "10px",
                    }}
                  >
                    <Fab>
                      <img
                        style={{
                          height: "60px",
                          width: "60px",
                          borderRadius: "50%",
                        }}
                        src={user.photoURL}
                        alt={"user display pic"}
                      />
                    </Fab>
                    <Chip color='secondary' label={user.displayName} />
                  </div>
                </ListItem>
                <ListItem className={styles.list_Item}>
                  <Card elevation={0} className={styles.list_cards}>
                    <Typography
                      align='center'
                      variant='subtitle1'
                      color='initial'
                    >
                      Theme
                    </Typography>
                    <div className={styles.theme_switcher}>
                      <input
                        type='radio'
                        id='remix-theme'
                        onChange={() => handleToggleTheme("remix")}
                        checked={Theme === "remix" ? true : false}
                        name='themes'
                      />
                      <label htmlFor='remix-theme'>
                        <span>
                          <RemixThemeIcon style={{ color: " #ff53a2" }} />
                          Remix
                        </span>
                      </label>
                      <input
                        type='radio'
                        id='dark-theme'
                        onChange={() => handleToggleTheme("dark")}
                        checked={Theme === "dark" ? true : false}
                        name='themes'
                      />
                      <label htmlFor='dark-theme'>
                        <span>
                          <DarkThemeIcon style={{ color: "#000" }} />
                          Dark
                        </span>
                      </label>
                      <input
                        type='radio'
                        id='light-theme'
                        name='themes'
                        onChange={() => handleToggleTheme("light")}
                        checked={Theme === "light" ? true : false}
                      />
                      <label htmlFor='light-theme'>
                        <span>
                          <LightThemeIcon style={{ color: "#ffd504" }} />
                          Light
                        </span>
                      </label>
                      <span className={styles.slider}></span>
                    </div>
                  </Card>
                </ListItem>
                <ListItem className={styles.list_Item}>
                  <Card
                    elevation={0}
                    className={cx(styles.list_cards, styles.bugReportCard)}
                  >
                    <Typography
                      align='center'
                      variant='subtitle1'
                      color='initial'
                    >
                      Report
                    </Typography>
                    <div
                      style={{
                        gap: "15px",
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <a
                        style={{ textDecoration: "none" }}
                        href='mailto:bhargabguy8@gmail.com?subject=uplora-Bugs&body=Here%2C%20write%20about%20the%20bugs%20you%20found%20while%20using%20Uplora...'
                      >
                        <Button
                          variant='contained'
                          className={styles.list_buttons}
                          size='small'
                          endIcon={<BugReportIcon />}
                        >
                          Bugs
                        </Button>
                      </a>

                      <a
                        style={{ textDecoration: "none" }}
                        href='mailto:bhargabguy8@gmail.com?subject=uplora-Issues&body=Here%2C%20write%20about%20the%20Issues%20you%20faced%20while%20using%20Uplora...'
                      >
                        <Button
                          variant='contained'
                          className={styles.list_buttons}
                          size='small'
                          endIcon={<IssuesIcon />}
                        >
                          Issues
                        </Button>
                      </a>
                      <a
                        style={{ textDecoration: "none" }}
                        href='mailto:bhargabguy8@gmail.com?subject=uplora-Ideas&body=Here%2C%20write%20about%20the%20ideas%20you%20think%20that%20it%20will%20make%20Uplora%20a%20better%20platform...'
                      >
                        <Button
                          variant='contained'
                          className={styles.list_buttons}
                          size='small'
                          endIcon={<IdeasIcon />}
                        >
                          Ideas
                        </Button>
                      </a>
                    </div>
                  </Card>
                </ListItem>
                <ListItem className={styles.list_Item}>
                  <Card
                    elevation={0}
                    className={cx(styles.list_cards, styles.bugReportCard)}
                  >
                    <Typography align='center' variant='body1' color='initial'>
                      Follow & Support the Dev
                    </Typography>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://www.instagram.com/________the_wrong_guy_______/'
                        style={{ textDecoration: "none", outline: "none" }}
                      >
                        <IconButton aria-label='instagram link'>
                          <InstagramIcon />
                        </IconButton>
                      </a>
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://github.com/the-wrong-guy'
                        style={{ textDecoration: "none", outline: "none" }}
                      >
                        <IconButton aria-label='github link'>
                          <GitHubIcon />
                        </IconButton>
                      </a>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <a href='https://www.buymeacoffee.com/bhargab' target='_'>
                        <img src={BMClogo} alt='buy me a coffee' />
                      </a>
                    </div>
                  </Card>
                </ListItem>
                <ListItem
                  className={styles.list_Item}
                  style={{ flexDirection: "column", gap: "10px" }}
                >
                  <Button
                    endIcon={<LogoutIcon />}
                    variant='contained'
                    className={styles.list_buttons}
                    size='small'
                    onClick={handleSignOut}
                  >
                    Logout
                  </Button>
                  <span
                    style={{
                      padding: "5px 10px",
                      fontSize: ".7rem",
                      color: "black",
                    }}
                  >
                    <b>Version:</b> beta@{process.env.REACT_APP_VERSION}
                  </span>
                </ListItem>
              </List>
            )}
          </div>
        </SwipeableDrawer>
      </AppBar>
    </React.Fragment>
  );
}

export default React.memo(Header);
