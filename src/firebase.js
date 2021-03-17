import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCBCWN1Bvph1gbUGQGZwVqkP2OFoLu654I",
  authDomain: "uplora.firebaseapp.com",
  projectId: "uplora",
  storageBucket: "uplora.appspot.com",
  messagingSenderId: "537369278099",
  appId: "1:537369278099:web:46ae8fd13e728cc359bf66",
  measurementId: "G-HPHSZY7MLE",
};

firebase.initializeApp(firebaseConfig);

firebase.analytics();
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export { db, auth, storage, googleProvider };
