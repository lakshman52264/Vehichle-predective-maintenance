// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDmJnSxI_AfP7LXN8gFn_3VyD6ONu7jRuk",
    authDomain: "predictive-maintenance-f112a.firebaseapp.com",
    projectId: "predictive-maintenance-f112a",
    storageBucket: "predictive-maintenance-f112a.appspot.com", // Corrected storage bucket URL
    messagingSenderId: "741287481031",
    appId: "1:741287481031:web:fca1881b805013085278e2",
    measurementId: "G-4SHNTK97FZ"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

export { db, auth };
