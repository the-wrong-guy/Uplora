import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { storage, db } from "../../firebase";
import { PhotoCamera } from "@material-ui/icons";
import CancelIcon from "@material-ui/icons/Cancel";
import { Button, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { v4 as uuidv4 } from "uuid";
import styles from "./imageUplaod.module.scss";

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

function ImageUpload({ displayName, userId, displayPic }) {
  const [image, setImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (!image) {
      setPreviewImg(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreviewImg(objectUrl);
    // eslint-disable-next-line consistent-return
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleImgCancel = () => {
    setImage(null);
  };

  const resetForm = () => {
    setImage(null);
    setPreviewImg(null);
    setCaption("");
    setUploading(false);
  };
  const handleUpload = async () => {
    if (image === null) {
      return;
    } else {
      try {
        setUploading(true);
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`images/${uuidv4()}-${image.name}`);
        await fileRef.put(image);
        const fileUrl = await fileRef.getDownloadURL();
        db.collection("posts").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          caption: caption,
          imageUrl: fileUrl,
          displayName,
          userId,
          displayPic,
          emojiCounter: [],
        });
        resetForm();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const classes = useStyles();

  const handleCancelImg = () => {
    setImage(null);
    setPreviewImg(null);
  };
  return (
    <div className={styles.imageupload}>
      <input
        accept='image/*,video/*'
        onChange={handleChange}
        className={classes.input}
        id='icon-button-file'
        type='file'
      />
      {previewImg && (
        <div>
          <IconButton
            className={styles.cancelBtn}
            aria-label='cancel image'
            onClick={handleCancelImg}
          >
            <CancelIcon />
          </IconButton>
          <img className={styles.previewImage} src={previewImg} alt='preview' />
        </div>
      )}

      <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <label htmlFor='icon-button-file'>
          <IconButton
            style={{ color: "#7FD1AE" }}
            aria-label='upload picture'
            component='span'
          >
            <PhotoCamera />
          </IconButton>
        </label>
        <input
          placeholder='enter caption...'
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          className={styles.input}
        />
      </div>

      <Button
        variant='contained'
        size='small'
        onClick={handleUpload}
        style={{
          marginTop: "5px",
          textTransform: "unset",
          background: "#8083FF",
        }}
      >
        {uploading ? (
          <img
            src='https://s2.svgbox.net/loaders.svg?ic=elastic-spinner&color=8b00ff'
            width='25'
            height='25'
            alt='uplaod loader'
          />
        ) : (
          "Upload"
        )}
      </Button>
    </div>
  );
}

export default ImageUpload;
