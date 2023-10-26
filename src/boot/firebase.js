// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase/app'
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics'

// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/database'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
  authDomain: 'nightlyfe-117a4.firebaseapp.com',
  databaseURL: 'https://nightlyfe-117a4-default-rtdb.firebaseio.com',
  projectId: 'nightlyfe-117a4',
  storageBucket: 'nightlyfe-117a4.appspot.com',
  messagingSenderId: '928276199112',
  appId: '1:928276199112:web:a8f1a82e5a2b272eb917fd',
  measurementId: 'G-Q0NX15EQ0Z'
}

// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig)
let firebaseAuth = firebaseApp.auth()
let firebaseDb = firebaseApp.database()
let analytics = firebaseApp.analytics()

export { firebaseAuth, firebaseDb, analytics }
