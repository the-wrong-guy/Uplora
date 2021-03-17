import React, { useState, useEffect } from "react";
import firebase from "firebase";
import {
  Fab,
  Grid,
  Slide,
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Paper,
  Divider,
  Snackbar,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../Redux/Action/action";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import AddIcon from "@material-ui/icons/Add";
import { auth, db, storage } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import Header from "../Header/header";
import Post from "../Post/post";
import styles from "./main.module.scss";

//Dialog Box Icons
import CloseIcon from "@material-ui/icons/Close";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import CheckIcon from "@material-ui/icons/Check";
import NoPreview from "./undraw_Photograph_re_up3b.svg";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function Main() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state.CONFIG.userInfo);
  const [latestDoc, setLatestDoc] = useState(null);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [uploadingSuccess, setUploadingSucess] = useState(false);
  const [imgWarningSnackbar, setImgWarningSnackbar] = useState(false);
  //Image Upload
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  useEffect(() => {
    if (!image) {
      setPreviewImage(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreviewImage(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  //For Caption TextBox
  const [caption, setCaption] = useState({
    text: "",
    rows: 2,
    minRows: 2,
    maxRows: 5,
  });

  const handleCaptionChange = (event) => {
    const textareaLineHeight = 20;

    const previousRows = event.target.rows;
    event.target.rows = caption.minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= caption.maxRows) {
      event.target.rows = caption.maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    setCaption({
      ...caption,
      text: event.target.value,
      rows: currentRows < caption.maxRows ? currentRows : caption.maxRows,
    });
  };

  //Checking for users
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(setUserInfo(authUser));
        history.push("/home");
      } else {
        dispatch(setUserInfo(null));
        history.push("/");
      }
    });
    return unsubscribe;
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleDialogBoxClose = () => {
    setOpen(false);
    setTimeout(() => {
      setImage(null);
    }, 300);
  };

  const resetImageUploadForm = () => {
    setCaption({
      ...caption,
      text: "",
      rows: 2,
    });
    setImage(null);
  };
  const handleImageUpload = async () => {
    if (image === null) {
      setImgWarningSnackbar(true);
      return;
    } else {
      try {
        setImgUploading(true);
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`images/${uuidv4()}-${image.name}`);
        await fileRef.put(image);
        const fileUrl = await fileRef.getDownloadURL();
        await db.collection("posts").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          caption: caption.text,
          imageUrl: fileUrl,
          displayName: user.displayName,
          userId: user.uid,
          displayPic: user.photoURL,
        });
        setImgUploading(false);
        setUploadingSucess(true);
        setTimeout(() => {
          setOpen(false);
          resetImageUploadForm();
        }, 500);
        setTimeout(() => {
          setUploadingSucess(false);
        }, 600);
      } catch (error) {
        setImgUploading(false);
        setUploadingSucess(false);
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const unsub = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .limit(15)
      .onSnapshot((snapShot) => {
        setPosts(
          snapShot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
        setLatestDoc(snapShot.docs[snapShot.docs.length - 1]);
      });

    return unsub;
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
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setImgWarningSnackbar(false);
  };
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Snackbar
        component='span'
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={imgWarningSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message='Add a photo by clicking on the camera icon'
        disableWindowBlurListener={true}
      />
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
        </>
      </Grid>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        fullScreen
        onClose={handleDialogBoxClose}
        aria-labelledby='alert-dialog-slide-upload'
        aria-describedby='alert-dialog-slide-upload'
        className={styles.dialogBox}
        transitionDuration={400}
      >
        <AppBar style={{ position: "relative" }}>
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              edge='start'
              color='inherit'
              onClick={handleDialogBoxClose}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
            <Typography variant='subtitle1' color='initial'>
              New post
            </Typography>
            <input
              style={{ display: "none" }}
              onChange={(e) => handleImageChange(e)}
              accept='image/*'
              id='upload-image-dailogbox'
              type='file'
            />
            <label htmlFor='upload-image-dailogbox'>
              <IconButton aria-label='open gallery' component='span'>
                <AddAPhotoIcon />
              </IconButton>
            </label>
          </Toolbar>
        </AppBar>
        <div
          style={{
            width: "100%",
            height: "calc(100vh - 64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{ maxWidth: "100%", maxHeight: "100%" }}
            src={previewImage || NoPreview}
            alt='preview img'
          />
        </div>
        <div style={{ display: "contents" }}>
          <Divider />
          <Paper
            elevation={5}
            style={{
              borderRadius: "0",
              flex: "1",
              display: "flex",
              alignItems: "center",
            }}
          >
            <textarea
              rows={caption.rows}
              value={caption.text}
              placeholder={"Add a caption..."}
              style={{
                width: "100%",
                position: "relative",
                border: "none",
                borderRadius: "3px",
                resize: "none",
                fontSize: "13.2px",
                lineHeight: "20px",
                overflow: "auto",
                height: "auto",
                padding: "8px",
                outline: "none",
                background: "transparent",
              }}
              className={styles.textBox}
              onChange={handleCaptionChange}
            />
          </Paper>
          <Button
            variant='contained'
            color='secondary'
            size='small'
            fullWidth
            onClick={() => handleImageUpload()}
            disabled={imgUploading}
            style={{ borderRadius: "0", fontWeight: "700" }}
          >
            {uploadingSuccess ? (
              <CheckIcon style={{ color: "green" }} />
            ) : imgUploading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <img
                  src='https://s2.svgbox.net/loaders.svg?ic=elastic-spinner&color=01983b'
                  width='15'
                  height='15'
                  alt='uploading'
                />
                uploading...
              </div>
            ) : (
              "upload"
            )}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
