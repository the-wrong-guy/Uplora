import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import { IconButton, Fab, Paper, Card, Chip } from "@material-ui/core";
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
import DefaultThemeIcon from "@material-ui/icons/FilterVintage";
//Report Icons
import BugReportIcon from "@material-ui/icons/BugReport";
import IdeasIcon from "@material-ui/icons/EmojiObjects";
import IssuesIcon from "@material-ui/icons/Warning";
//Social Icons
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import RedditIcon from "@material-ui/icons/Reddit";

//logo
import UploraLogo3 from "./Untitled_design__20_-removebg-preview.png";
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
              src={UploraLogo3}
              style={{ height: "34px" }}
              alt='uplora logo'
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
                          <DefaultThemeIcon style={{ color: " #ff53a2" }} />
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
                      <Button
                        variant='contained'
                        className={styles.list_buttons}
                        size='small'
                        endIcon={<BugReportIcon />}
                      >
                        Bugs
                      </Button>
                      <Button
                        variant='contained'
                        className={styles.list_buttons}
                        size='small'
                        endIcon={<IssuesIcon />}
                      >
                        Issues
                      </Button>
                      <Button
                        variant='contained'
                        className={styles.list_buttons}
                        size='small'
                        endIcon={<IdeasIcon />}
                      >
                        Ideas
                      </Button>
                    </div>
                  </Card>
                </ListItem>
                <ListItem className={styles.list_Item}>
                  <Card
                    elevation={0}
                    className={cx(styles.list_cards, styles.bugReportCard)}
                  >
                    <Typography align='center' variant='body1' color='initial'>
                      Follow the Dev
                    </Typography>
                    <div>
                      <IconButton aria-label='instagram link'>
                        <InstagramIcon />
                      </IconButton>
                      <IconButton aria-label='github link'>
                        <GitHubIcon />
                      </IconButton>
                      <IconButton aria-label='redit link'>
                        <RedditIcon />
                      </IconButton>
                    </div>
                  </Card>
                </ListItem>
                <ListItem
                  style={{ marginTop: "auto" }}
                  className={styles.list_Item}
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
