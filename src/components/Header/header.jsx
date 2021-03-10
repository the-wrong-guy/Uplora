import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { IconButton, Fab, Paper, Card, Chip } from "@material-ui/core";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import styles from "./header.module.scss";
import { db, auth } from "../../firebase";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import BottomAppBar from "../Footer/footer";
import cx from "classnames";

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
function BackToTop(props) {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

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
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar style={{ backgroundColor: "#ffffff" }}>
        <Toolbar className={styles.toolbar}>
          <div>
            <Typography
              className={styles.header}
              style={{ color: "#000000" }}
              variant='h6'
            >
              Uplora
            </Typography>
          </div>
          {user && (
            <div className={styles.logout}>
              <IconButton
                aria-label='menu toggle'
                onClick={() => setOpen(!open)}
              >
                <Fab size='small' color='default' aria-label=''>
                  <img
                    className={styles.displayPic}
                    src={user.photoURL}
                    alt='display pic'
                  />
                </Fab>
              </IconButton>
            </div>
          )}
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
                    <Chip color='primary' label={user.displayName} />
                  </div>
                </ListItem>
                <ListItem className={styles.list_Item}>
                  <div className={styles.list_cards}>
                    <Typography
                      align='center'
                      variant='subtitle1'
                      color='initial'
                    >
                      Theme
                    </Typography>
                    <div className={styles.theme_switcher}>
                      <input type='radio' id='default-theme' name='themes' />
                      <label htmlFor='default-theme'>
                        <span>
                          <DefaultThemeIcon />
                          Default
                        </span>
                      </label>
                      <input type='radio' id='dark-theme' name='themes' />
                      <label htmlFor='dark-theme'>
                        <span>
                          <DarkThemeIcon />
                          Dark
                        </span>
                      </label>
                      <input type='radio' id='light-theme' name='themes' />
                      <label htmlFor='light-theme'>
                        <span>
                          <LightThemeIcon />
                          Light
                        </span>
                      </label>
                      <span className={styles.slider}></span>
                    </div>
                  </div>
                </ListItem>
                <ListItem className={styles.list_Item}>
                  <div className={cx(styles.list_cards, styles.bugReportCard)}>
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
                  </div>
                </ListItem>
                <ListItem className={styles.list_Item}>
                  <div className={cx(styles.list_cards, styles.bugReportCard)}>
                    <Typography align='center' variant='body1' color='initial'>
                      Follow the Dev
                    </Typography>
                    <div>
                      <IconButton aria-label='insta'>
                        <InstagramIcon style={{ color: "#737374" }} />
                      </IconButton>
                      <IconButton aria-label='insta'>
                        <GitHubIcon style={{ color: "#737374" }} />
                      </IconButton>
                      <IconButton aria-label='insta'>
                        <RedditIcon style={{ color: "#737374" }} />
                      </IconButton>
                    </div>
                  </div>
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
                    onClick={() => auth.signOut()}
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

export default React.memo(BackToTop);
