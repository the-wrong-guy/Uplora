import firebase, { firestore } from 'firebase'


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyByxMOEGmDye_KTp3TSvfJbgfaxMBKUXUU",
    authDomain: "insta-clone-100-37426.firebaseapp.com",
    databaseURL: "https://insta-clone-100-37426.firebaseio.com",
    projectId: "insta-clone-100-37426",
    storageBucket: "insta-clone-100-37426.appspot.com",
    messagingSenderId: "664451095714",
    appId: "1:664451095714:web:97034ab28428e299910bfb"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export {db,auth,storage}
 
//   export default firebaseConfig