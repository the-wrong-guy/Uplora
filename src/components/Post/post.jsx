import React, { useState, useEffect } from "react";
import {
  Paper,
  Avatar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Fade,
} from "@material-ui/core";
import { db } from "../../firebase";
import styles from "./post.module.scss";
import firebase, { database } from "firebase";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Skeleton from "@material-ui/lab/Skeleton";
import { PokemonSelector, PokemonCounter } from "@charkour/react-reactions";
import moment from "moment";
import { v4 as uuid } from "uuid";
import PokeBall from "./icons8-pokeball-48.png";

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
  const [comments, setcomments] = useState([]);
  const [counter, setCounter] = useState([]);
  const [comment, setComment] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [emojiSelector, setEmojiSelector] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    console.log("Close");
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
          const data = snapshot.docs.map((doc) => doc.data());
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
    if (user && user.uid === postUserId) {
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
          <div style={{ display: "grid", marginLeft: "8px" }}>
            <span className={styles.username}>
              {displayName && displayName}
            </span>
            <span style={{ fontSize: "11px", color: "#ababab" }}>
              {createdAt && moment(createdAt.toDate()).fromNow()}
            </span>
          </div>
        </div>
        <div>
          <IconButton onClick={handleClick} aria-label='options'>
            <MoreVertIcon />
            <Menu
              id='fade-menu'
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
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
          alt={imageUrl}
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
          alt={imageUrl}
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
          padding: "5px 10px",
        }}
      >
        {counter && (
          <PokemonCounter
            counters={counter}
            user={user.displayName}
            bg='lightgray'
          />
        )}
        <div style={{ float: "right", display: "flex" }}>
          <div style={{ overflow: "hidden" }}>
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
              src={PokeBall}
              alt='emoji selctor'
            />
          </IconButton>
        </div>
      </div>

      <div>
        {comments.map((comment) => (
          <div key={uuid()} className={styles.users_comments}>
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
              }}
            >
              {comment.displayName}
            </span>
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
