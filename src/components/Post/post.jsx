import React, { useState, useEffect } from "react";
import {
  Paper,
  Avatar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { db } from "../../firebase";
import styles from "./post.module.scss";
import firebase from "firebase";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Skeleton from "@material-ui/lab/Skeleton";
import { PokemonSelector, PokemonCounter } from "@charkour/react-reactions";

function Post({
  postId,
  displayName,
  displayPic,
  caption,
  imageUrl,
  user,
  postUserId,
}) {
  const [comments, setcomments] = useState([]);
  const [comment, setComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setcomments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      displayName,
      displayPic,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  const handleDeletePost = () => {
    if (user.uid === postUserId) {
      db.collection("posts")
        .doc(postId)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  return (
    <Paper elevation={15} className={styles.paper}>
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

          <Typography className={styles.username}>{displayName}</Typography>
        </div>
        <div>
          <IconButton onClick={handleClick} aria-label='options'>
            <MoreVertIcon />
            <Menu
              id='simple-menu'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Edit</MenuItem>
              <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
              <MenuItem onClick={handleClose}>Share</MenuItem>
            </Menu>
          </IconButton>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          background: "#fff",
          position: "relative",
        }}
      >
        <img
          className={styles.post_img}
          src={imageUrl}
          alt='user uploaded pics'
          loading='lazy'
          style={{
            opacity: "0.1",
            filter: "blur(4px)",
          }}
          onLoad={() => setImageLoaded(true)}
        />
        <img
          className={styles.post_img}
          src={imageUrl}
          alt='user uploaded pics'
          style={{
            opacity: imageLoaded ? "1" : "0",
            transition: "opacity ease-in-out 1s",
            transitionDelay: "1000ms",
            position: "absolute",
            top: 0,
          }}
        />
      </div>
      {caption !== "" && (
        <div className={styles.post_footer}>
          <Typography
            variant='caption'
            color='initial'
            style={{ fontWeight: "bold", paddingRight: "5px" }}
          >
            {displayName}
          </Typography>
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
          padding: "5px 10px",
        }}
      >
        <div>
          <PokemonCounter />
        </div>
        <div>
          <PokemonSelector iconSize={20} />
        </div>
      </div>

      <div>
        {comments.map((comment) => (
          <div className={styles.users_comments}>
            <img
              className={styles.commentersPic}
              src={comment.displayPic}
              alt='commenter pic'
            />
            <Typography
              variant='caption'
              color='initial'
              style={{ fontWeight: "bold", paddingRight: "5px" }}
            >
              {comment.displayName}
            </Typography>
            <Typography
              variant='caption'
              className={styles.posted_comments}
              color='initial'
            >
              {comment.text}
            </Typography>
          </div>
        ))}
      </div>

      <div className={styles.comment_box}>
        <textarea
          className={styles.comment_box_input}
          type='text'
          placeholder='Add a comment...'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          className={styles.comment_box_button}
          disabled={!comment}
          type='submit'
          onClick={postComment}
        >
          post
        </Button>
      </div>
    </Paper>
  );
}

export default React.memo(Post);
