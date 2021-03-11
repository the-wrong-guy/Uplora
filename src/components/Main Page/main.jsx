import React, { useState, useEffect } from "react";
import { Fab, Grid, Paper } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../Redux/Action/action";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import AddIcon from "@material-ui/icons/Add";
import { auth, db } from "../../firebase";
import Header from "../Header/header";
import Post from "../Post/post";
import ImageUpload from "../Upload/imageUplaod";
import SmoothScroll from "../SmoothScroll/smoothScroll";
import styles from "./main.module.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function Main() {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [latestDoc, setLatestDoc] = useState(null);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        dispatch(setUserInfo(authUser));
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

  const test = [];
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .limit(15)
      .onSnapshot((snapShot) => {
        setPosts(
          snapShot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
        setLatestDoc(snapShot.docs[snapShot.docs.length - 1]);
      });

    // return unsub;
  }, []);

  // debugger;
  const loadMorePosts = async () => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .startAfter(latestDoc)
      .limit(15)
      .onSnapshot((snapShot) => {
        setPosts([
          ...posts,
          ...snapShot.docs.map((doc) => ({ id: doc.id, post: doc.data() })),
        ]);
        setLatestDoc(snapShot.docs[snapShot.docs.length - 1]);
        setHasMorePosts(snapShot.docs.length > 0);
      });
    console.log(posts);
    console.log(test);
    console.log(latestDoc);
  };

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

      <Grid
        style={{ margin: "64px 0" }}
        container
        justify='center'
        direction='row'
      >
        <>
          {user && posts ? (
            posts.map(({ id, post }) => (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{ display: "flex", justifyContent: "center" }}
                key={id}
              >
                <Post
                  postId={id}
                  username={post.username}
                  postUserId={post.userId}
                  user={user}
                  displayName={post.displayName}
                  displayPic={post.displayPic}
                  caption={post.caption}
                  imageUrl={post.imageUrl}
                  createdAt={post.timestamp}
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
        </>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button onClick={loadMorePosts} variant='contained' color='default'>
            Load More
          </Button>
        </Grid>
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
