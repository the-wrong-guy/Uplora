import firebase, { firestore } from 'firebase'


const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA1lt0_lYdRgHPeY4zzU--3U7UssRRzhUs",
  authDomain: "insta-clone-100.firebaseapp.com",
  databaseURL: "https://insta-clone-100.firebaseio.com",
  projectId: "insta-clone-100",
  storageBucket: "insta-clone-100.appspot.com",
  messagingSenderId: "901910020897",
  appId: "1:901910020897:web:760fb296c1888825807460",
  measurementId: "G-269XNPBWDX"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export {db,auth,storage}
 
//   export default firebaseConfig


// apiKey: "AIzaSyByxMOEGmDye_KTp3TSvfJbgfaxMBKUXUU",
//     authDomain: "insta-clone-100-37426.firebaseapp.com",
//     databaseURL: "https://insta-clone-100-37426.firebaseio.com",
//     projectId: "insta-clone-100-37426",
//     storageBucket: "insta-clone-100-37426.appspot.com",
//     messagingSenderId: "664451095714",
//     appId: "1:664451095714:web:97034ab28428e299910bfb"