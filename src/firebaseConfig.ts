// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "barneshome-3dfbb.firebaseapp.com",
    projectId: "barneshome-3dfbb",
    storageBucket: "barneshome-3dfbb.appspot.com",
    messagingSenderId: "444159558348",
    appId: "1:444159558348:web:54b1bfc5aa65235b89b869",
    measurementId: "G-RPPB4920LY"
  };
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
