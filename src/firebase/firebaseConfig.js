// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyALJ53dcz22MuSLfgCa9Zv0zV2YFpVYGrU",
    authDomain: "adminphone-27264.firebaseapp.com",
    projectId: "adminphone-27264",
    storageBucket: "adminphone-27264.appspot.com",
    messagingSenderId: "895978622993",
    appId: "1:895978622993:web:e6fee92703cc7e58a461b0",
    measurementId: "G-83GC9ECCRE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
// const analytics = getAnalytics(app); 