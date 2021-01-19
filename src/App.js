import React, { useState, useEffect } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./components/Header/header";
import Post from "./components/Post/post";
import ImageUpload from "./components/Upload/imageUplaod";
import { db, auth } from "./firebase";
import { Modal, Paper, Button, Typography, Input } from "@material-ui/core";
import { app } from "firebase";
import BottomAppBar from "./components/Footer/footer";
import Login from "./components/Login page/login";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    padding: theme.spacing(2, 4, 3),
    backgroundColor: "#fff",
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapShot) => {
        setPosts(
          snapShot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  // const signUp = (event) =>{
  //   event.preventDefault();
  //   auth
  //   .createUserWithEmailAndPassword(email,password)
  //   .then((authUser)=>{
  //    return  authUser.user.updateProfile({
  //       displayName : username
  //     })
  //   })
  //   .catch(error=>alert(error.message))

  //   setOpen(false)
  // }

  // const signIn = (event) =>{
  //   event.preventDefault()

  //   auth
  //   .signInWithEmailAndPassword(email,password)
  //   .catch(err=>alert(err.message))

  //   setOpenSignIn(false)
  // }

  return (
    <div className='App'>
      <Header />
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <Login />
      )}
      {user?.displayName
        ? posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              username={post.username}
              user={user}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))
        : ""}
    </div>
  );
}

export default App;

{
  /* user?.displayName ?  (<BottomAppBar username={user.displayName}/>) : ('') */
}

{
  /*sadsad*/
}
