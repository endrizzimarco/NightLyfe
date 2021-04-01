// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBPUdoB3wV6A9L-H1-J5POiQRmgqqcL9Bk",
  authDomain: "nightlyfe-308016.firebaseapp.com",
  projectId: "nightlyfe-308016",
  storageBucket: "nightlyfe-308016.appspot.com",
  messagingSenderId: "469882119194",
  appId: "1:469882119194:web:4ead2d00c69be60ec41da3",
  measurementId: "G-E6SZFDYGCD"
};

// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth()
let firebaseDb = firebaseApp.database()
let analytics = firebaseApp.analytics()

export { firebaseAuth, firebaseDb, analytics}