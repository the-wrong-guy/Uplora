import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../Redux/Action/action";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { auth, db } from "../../firebase";
import Header from "../Header/header";
import SinglePostCard from "../Post/singlePost";
import { Helmet } from "react-helmet";
export default function IndividualPost() {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  let { id } = useParams();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(setUserInfo(authUser));
        setUser(authUser);
      } else {
        dispatch(setUserInfo(null));
        history.push("/");
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log(id);
    const unsub = db
      .collection("posts")
      .doc(id)
      .onSnapshot((doc) => {
        console.log("Current data: ", doc.data());
        setPost(doc.data());
      });
    return unsub;
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Helmet>
        {/*Primary Meta Tags*/}
        <title>Uplora</title>
        <meta name='title' content='Uplora' />
        <meta name='description' content={`${post.caption}`} />
        <link rel='canonical' href='https://uplora.netlify.app' />

        {/*Open Graph / Facebook*/}
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://uplora.netlify.app' />
        <meta property='og:title' content='Uplora' />
        <meta property='og:description' content={`${post.caption}`} />
        <meta
          property='og:image'
          itemprop='image'
          content={`${post.imageUrl}`}
        />

        {/*Twitter*/}
        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content='https://uplora.netlify.app' />
        <meta property='twitter:title' content='Uplora' />
        <meta property='twitter:description' content={`${post.caption}`} />
        <meta property='twitter:image' content={`${post.imageUrl}`} />
      </Helmet>
      {user ? (
        <>
          <Header />
          <div
            style={{
              marginTop: "64px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {post ? (
              <SinglePostCard
                postId={id}
                displayName={post.displayName}
                displayPic={post.displayPic}
                caption={post.caption}
                imageUrl={post.imageUrl}
                user={user}
                postUserId={post.userId}
                createdAt={post.timeStamp}
              />
            ) : (
              "loading"
            )}
          </div>
        </>
      ) : (
        "loading"
      )}
    </div>
  );
}
