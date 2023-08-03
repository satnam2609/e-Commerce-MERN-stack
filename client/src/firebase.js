// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCb179DX0CKvAS5UPU6LYQRbLd114JpZ5k",
  authDomain: "ecommerce-7949c.firebaseapp.com",
  projectId: "ecommerce-7949c",
  storageBucket: "ecommerce-7949c.appspot.com",
  messagingSenderId: "691508777325",
  appId: "1:691508777325:web:c15510aefa95eae652ca64",
  measurementId: "G-ZEXZSDWL5F",
};

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
