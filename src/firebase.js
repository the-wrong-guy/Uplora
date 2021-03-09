import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDXOLKwh4rhwjj2PTMQfRcYtYAGip_FWdw",
  authDomain: "pixex-15977.firebaseapp.com",
  projectId: "pixex-15977",
  storageBucket: "pixex-15977.appspot.com",
  messagingSenderId: "574601452026",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export { db, auth, storage, googleProvider };
