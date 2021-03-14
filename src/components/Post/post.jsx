import React, { useState, useEffect } from "react";
import {
  Paper,
  Avatar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Snackbar,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { db } from "../../firebase";
import styles from "./post.module.scss";
import { useSelector } from "react-redux";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { PokemonSelector, PokemonCounter } from "@charkour/react-reactions";
import moment from "moment";
import cx from "classnames";
import { v4 as uuid } from "uuid";
import TextArea from "./textBox";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

// Bottom Drawer Icons
import DeleteIcon from "@material-ui/icons/Delete";
import CopyIcon from "@material-ui/icons/FileCopy";
import ReportIcon from "@material-ui/icons/Report";
import DownloadIcon from "@material-ui/icons/GetApp";

// Testing
const fs = require("fs");
const path = require("path");
const axios = require("axios").default;

const DrawerStyle = makeStyles({
  paper: {
    borderTopRightRadius: "15px",
    borderTopLeftRadius: "15px",
  },
});

function Post({
  postId,
  displayName,
  displayPic,
  caption,
  imageUrl,
  user,
  postUserId,
  createdAt,
}) {
  const DrawerStyles = DrawerStyle();
  const GlobalTheme = useSelector((state) => state.CONFIG.GlobalTheme);
  const [SnackBarOpen, setSnackBarOpen] = useState(false);
  const [ReportSnackBarOpen, setReportSnackBarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [comments, setcomments] = useState([]);
  const [counter, setCounter] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [emojiSelector, setEmojiSelector] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const handleMoreVertIconClick = (event) => {
    setDrawerOpen(true);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
    setReportSnackBarOpen(false);
  };

  const toggleDrawer = (anchor, e) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(e);
  };

  const handleDownloadPostImg = async (fileUrl, downloadFolder) => {
    // Get the file name
    const fileName = path.basename(fileUrl);

    // The path of the downloaded file on our machine
    const localFilePath = path.resolve(__dirname, downloadFolder, fileName);
    try {
      const response = await axios({
        method: "GET",
        url: fileUrl,
        responseType: "stream",
      });

      await response.data.pipe(fs.createWriteStream(localFilePath));
      console.log("Successfully downloaded file!");
    } catch (err) {
      throw new Error(err);
    }
  };

  const handleShareLink = () => {
    setSnackBarOpen(true);
    setDrawerOpen(false);
  };
  const themeFuncForBorders = () => {
    if (GlobalTheme === "dark") {
      return "rgb(70 70 70)";
    } else if (GlobalTheme === "light") {
      return "rgb(240 240 240)";
    } else if (GlobalTheme === "remix") {
      return "rgb(194 181 255)";
    }
  };

  const themeFuncForRectSkeleton = () => {
    if (GlobalTheme === "dark") {
      return "#595959";
    } else if (GlobalTheme === "light") {
      return "rgb(199 199 199 / 71%)";
    } else if (GlobalTheme === "remix") {
      return "rgb(111 142 228 / 71%)";
    }
  };

  const themeFuncForViewMore = () => {
    if (GlobalTheme === "dark") {
      return "#737373";
    } else if (GlobalTheme === "light") {
      return "#cccccc";
    } else if (GlobalTheme === "remix") {
      return "rgb(255 150 59)";
    }
  };
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .limit(2)
        .onSnapshot((snapshot) => {
          setcomments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("emojiCounter")
        .onSnapshot((snapshot) => {
          setCounter(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const handleDeletePost = () => {
    if (user && user.uid === postUserId) {
      db.collection("posts")
        .doc(postId)
        .delete()
        .then(() => {
          toggleDrawer("bottom", false);
          console.log("Document successfully deleted!");
          setDeleteError(false);
        })
        .catch((error) => {
          setDeleteError(true);
          console.error("Error removing document: ", error);
        });
    }
  };

  const handleReportPost = () => {
    if (user) {
      try {
        db.collection("reported_post")
          .doc(postId)
          .collection("reports")
          .doc(user.uid)
          .set({
            userName: user.displayName,
            userId: user.uid,
            postId: postId,
          });
        setReportSnackBarOpen(true);
        setDrawerOpen(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onReactionSelect = (e) => {
    if (user) {
      db.collection("posts")
        .doc(postId)
        .collection("emojiCounter")
        .doc(user.uid)
        .set({
          emoji: e,
          by: user.displayName,
        });
      setEmojiSelector(false);
    }
  };

  return (
    <Paper elevation={15} className={cx(styles.paper)}>
      <Snackbar
        component='span'
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={SnackBarOpen}
        autoHideDuration={1800}
        onClose={handleSnackBarClose}
        message='Copied'
        disableWindowBlurListener={true}
      />
      <Snackbar
        component='span'
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={ReportSnackBarOpen}
        autoHideDuration={1800}
        onClose={handleSnackBarClose}
        message='Reported!'
        disableWindowBlurListener={true}
      />
      <div className={styles.post_header}>
        <div className={styles.post_header_profile}>
          {displayPic ? (
            <Avatar
              className={styles.post_avatar}
              alt='Cindy Baker'
              src={displayPic}
            />
          ) : (
            <Skeleton
              animation='wave'
              variant='circle'
              width={40}
              height={40}
            />
          )}
          <div style={{ display: "grid", marginLeft: "8px" }}>
            <Typography color='textPrimary' className={styles.username}>
              {displayName && displayName}
            </Typography>
            <Typography color='textSecondary' style={{ fontSize: "11px" }}>
              {createdAt && moment(createdAt.toDate()).fromNow()}
            </Typography>
          </div>
        </div>
        <div>
          <IconButton
            onClick={handleMoreVertIconClick}
            aria-label='user options'
          >
            <MoreVertIcon />
          </IconButton>
          <Drawer
            classes={{ paper: DrawerStyles.paper }}
            anchor={"bottom"}
            open={drawerOpen}
            onClose={toggleDrawer("bottom", false)}
            transitionDuration={400}
          >
            <div style={{ width: "100vw", height: "30vh" }}>
              <List>
                <CopyToClipboard
                  text={`https://uplora.netlify.app/${postId}`}
                  onCopy={() => handleShareLink()}
                >
                  <ListItem button>
                    <ListItemIcon>
                      <CopyIcon />
                    </ListItemIcon>
                    <ListItemText primary='Copy link' />
                  </ListItem>
                </CopyToClipboard>
                <ListItem
                  button
                  onClick={() => handleDownloadPostImg(imageUrl, "download")}
                >
                  <ListItemIcon>
                    <DownloadIcon />
                  </ListItemIcon>
                  <ListItemText primary='Download' />
                </ListItem>
                <ListItem button onClick={() => handleReportPost()}>
                  <ListItemIcon>
                    <ReportIcon />
                  </ListItemIcon>
                  <ListItemText primary='Report' />
                </ListItem>
                {user.uid === postUserId && (
                  <ListItem button onClick={() => handleDeletePost()}>
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary='Delete' />
                    {deleteError && (
                      <Typography variant='caption' color='error'>
                        !Error
                      </Typography>
                    )}
                  </ListItem>
                )}
              </List>
            </div>
          </Drawer>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          background: "#fff",
          position: "relative",
          minHeight: "210px",
          maxHeight: "450px",
        }}
      >
        <img
          className={styles.post_img}
          src={imageUrl}
          alt={imageUrl}
          onLoad={() => setImageLoaded(true)}
          style={{
            opacity: imageLoaded ? "1" : "0",
            transition: "opacity ease-in-out 1s",
          }}
        />
        {!imageLoaded && (
          <Skeleton
            style={{
              width: "100%",
              height: "100%",
              background: `${themeFuncForRectSkeleton()}`,
              position: "absolute",
            }}
            animation='wave'
            variant='rect'
          />
        )}
      </div>
      {caption !== "" && (
        <div className={styles.post_footer}>
          <span
            style={{
              fontWeight: "600",
              paddingRight: "5px",
              fontSize: "12.5px",
            }}
          >
            {displayName}
          </span>
          <Typography variant='caption' color='initial'>
            {caption}
          </Typography>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 10px",
          borderTop: `1px solid ${themeFuncForBorders()}`,
        }}
      >
        {counter && (
          <PokemonCounter
            counters={counter}
            user={user.displayName}
            bg='lightgray'
            alwaysShowOthers={false}
          />
        )}
        <div style={{ float: "right", display: "flex", position: "relative" }}>
          <div style={{ position: "relative", overflowX: "hidden" }}>
            <div
              className={
                emojiSelector
                  ? styles.PokemonSelector_Active
                  : styles.PokemonSelector_Idle
              }
            >
              <PokemonSelector onSelect={onReactionSelect} iconSize={20} />
            </div>
          </div>

          <IconButton
            onClick={() => setEmojiSelector(!emojiSelector)}
            size='small'
          >
            <img
              style={{ height: "30px", width: "30px" }}
              src={"https://img.icons8.com/fluent/48/000000/pokemon.png"}
              alt='emoji selctor'
            />
          </IconButton>
        </div>
      </div>

      {comments.length > 0 && (
        <div
          style={{
            position: "relative",
            width: "100%",
            borderTop: `1px solid ${themeFuncForBorders()}`,
          }}
        >
          {comments.map((comment) => (
            <div
              style={{ position: "relative", width: "100%" }}
              key={uuid()}
              className={styles.users_comments}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <img
                  className={styles.commentersPic}
                  src={comment.displayPic}
                  alt='commenter pic'
                />
                <span
                  style={{
                    fontWeight: "bold",
                    paddingRight: "5px",
                    fontSize: "12.5px",
                    display: "inline-block",
                    width: "min-content",
                    whiteSpace: "pre",
                  }}
                >
                  {comment.displayName}
                </span>
              </div>

              <span
                variant='caption'
                className={styles.posted_comments}
                color='initial'
              >
                {comment.text.length > 60 ? (
                  <>
                    {`${comment.text.substring(0, 60)}`}
                    <Link
                      style={{
                        textDecoration: "none",
                        color: `${themeFuncForViewMore()}`,
                      }}
                      to={{
                        pathname: `/${postId}`,
                      }}
                    >
                      ...Read more
                    </Link>
                  </>
                ) : (
                  comment.text
                )}
              </span>
            </div>
          ))}

          {comments.length === 2 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <Link
                style={{
                  textDecoration: "none",
                  marginLeft: "10px",
                  color: `${themeFuncForViewMore()}`,
                }}
                to={{
                  pathname: `/${postId}`,
                }}
              >
                view more comments...
              </Link>
            </div>
          )}
        </div>
      )}

      <div style={{ borderTop: `1px solid ${themeFuncForBorders()}` }}>
        <div style={{ display: "flex", flex: "1" }}>
          <TextArea postId={postId} />
        </div>
      </div>
    </Paper>
  );
}

export default React.memo(Post);
