import React, { useState } from "react";
import firebase from "firebase";
import { storage, db } from "../../firebase";
import {
  PhotoCamera,
  CloudUpload as CloudUploadIcon,
} from "@material-ui/icons";
import {
  Button,
  IconButton,
  LinearProgress,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { v4 as uuidv4 } from "uuid";
import "./imageUplaod.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (image === null) {
      return;
    } else {
      try {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            console.log(error);
            alert(error.message);
          },
          () => {
            storage
              .ref("images")
              .child(image.name)
              .getDownloadURL()
              .then((url) => {
                db.collection("posts").add({
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  caption: caption,
                  imageUrl: url,
                  username: username,
                });
              });
            setProgress(0);
            setCaption("");
            setImage(null);
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const classes = useStyles();

  return (
    <div className='imageupload'>
      <input
        accept='image/*,video/*'
        onChange={handleChange}
        className={classes.input}
        id='icon-button-file'
        type='file'
      />
      <label htmlFor='icon-button-file'>
        <IconButton
          color='primary'
          aria-label='upload picture'
          component='span'
        >
          <PhotoCamera />
        </IconButton>
      </label>
      <TextField
        label='Caption'
        multiline
        rows={4}
        placeholder='enter your caption...'
        variant='outlined'
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <progress
        style={{ width: "200px", marginTop: "7px" }}
        className='imageupload_progress'
        value={progress}
        max='100'
      />
      <Button
        variant='contained'
        color='default'
        onClick={handleUpload}
        startIcon={<CloudUploadIcon />}
        style={{ marginTop: "5px" }}
      >
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
