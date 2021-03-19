import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "uplora.firebaseapp.com",
  projectId: "uplora",
  storageBucket: "uplora.appspot.com",
  messagingSenderId: "537369278099",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-HPHSZY7MLE",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export { db, auth, storage, googleProvider };
