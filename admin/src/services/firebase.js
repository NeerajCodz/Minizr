// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC0JgeX4wDWFjwn4nlZSSR5YXas96tQPzI",
    authDomain: "minizr.firebaseapp.com",
    databaseURL: "https://minizr-default-rtdb.firebaseio.com",
    projectId: "minizr",
    storageBucket: "minizr.appspot.com",
    messagingSenderId: "913821958493",
    appId: "1:913821958493:web:004a65cdbc675f5958a8b4",
    measurementId: "G-39S1CYDCRL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };