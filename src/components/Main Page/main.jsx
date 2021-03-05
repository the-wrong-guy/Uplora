import React, { useState, useEffect } from "react";
import { Fab, Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import AddIcon from "@material-ui/icons/Add";
import { auth, db } from "../../firebase";
import Header from "../Header/header";
import Post from "../Post/post";
import PostSkeleton from "../Post/postSkeleton";
import ImageUpload from "../Upload/imageUplaod";
import styles from "./main.module.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function Main() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
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

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapShot) => {
        setPosts(
          snapShot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Fab
        onClick={handleClickOpen}
        className={styles.addBtn}
        color='primary'
        aria-label='add'
      >
        <AddIcon />
      </Fab>
      <Header />
      <Grid style={{ margin: "64px 0" }} container justify='center'>
        {user && posts ? (
          posts.map(({ id, post }) => (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Post
                key={id}
                postId={id}
                username={post.username}
                postUserId={post.userId}
                user={user}
                displayName={post.displayName}
                displayPic={post.displayPic}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            </Grid>
          ))
        ) : (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            loading...
          </Grid>
        )}
      </Grid>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
        className={styles.dialogBox}
      >
        {user && (
          <ImageUpload
            displayName={user.displayName}
            displayPic={user.photoURL}
            userId={user.uid}
          />
        )}

        <DialogActions>
          <Button
            onClick={handleClose}
            style={{ color: "#7FD1AE", textTransform: "unset" }}
          >
            cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
