import React, { useState } from "react";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { setTextPresence } from "../../Redux/Action/action";
import { Button } from "@material-ui/core";
import { db } from "../../firebase";
import styles from "./post.module.scss";

function ResizableTextarea({ postId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.CONFIG.userInfo);
  const [comment, setComment] = useState({
    text: "",
    rows: 1,
    minRows: 1,
    maxRows: 7,
  });

  const handleChange = (event) => {
    const textareaLineHeight = 20;

    const previousRows = event.target.rows;
    event.target.rows = comment.minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= comment.maxRows) {
      event.target.rows = comment.maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    setComment({
      ...comment,
      text: event.target.value,
      rows: currentRows < comment.maxRows ? currentRows : comment.maxRows,
    });
  };

  const postComment = () => {
    if (user) {
      db.collection("posts").doc(postId).collection("comments").add({
        text: comment.text,
        displayName: user.displayName,
        displayPic: user.photoURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setComment({
        ...comment,
        text: "",
        rows: 1,
      });
    }
  };

  return (
    <>
      <textarea
        rows={comment.rows}
        value={comment.text}
        placeholder={"Add a comment..."}
        style={{
          width: "100%",
          position: "relative",
          boxSizing: "border-box",
          border: "none",
          borderRadius: "3px",
          resize: "none",
          fontSize: "13.2px",
          lineHeight: "20px",
          overflow: "auto",
          height: "auto",
          padding: "8px",
          outline: "none",
          backgroundColor: "#cdc3ff",
        }}
        className={styles.textBox}
        onChange={handleChange}
      />
      <Button
        className={styles.comment_box_button}
        disabled={!comment.text}
        type='submit'
        onClick={postComment}
      >
        post
      </Button>
    </>
  );
}

export default React.memo(ResizableTextarea);
