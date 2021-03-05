import React, { useState, useEffect } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import {
  BrowserRouter as Router,
  Route,
  useHistory,
  Switch,
} from "react-router-dom";
import ImageUpload from "./components/Upload/imageUplaod";
import { db, auth } from "./firebase";
import LoginPage from "./components/Login page/login";
import MainPage from "./components/Main Page/main";

function App() {
  const history = useHistory();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        history.push("/home");
      } else {
        history.push("/");
      }
    });
    return unsubscribe;
  }, []);


  return (
      <div className='App'>
        <Switch>
          <Route exact path='/'>
            <LoginPage />
          </Route>
          <Route path='/home'>
            <MainPage />
          </Route>
        </Switch>
      </div>
  );
}

export default App;
