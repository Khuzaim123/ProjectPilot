// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBd0CpGvBDkf-JySSuQYEsuEL-H5oNszow",
    authDomain: "projectarc-731d2.firebaseapp.com",
    projectId: "projectarc-731d2",
    storageBucket: "projectarc-731d2.firebasestorage.app",
    messagingSenderId: "417148160776",
    appId: "1:417148160776:web:0d7ca0055c1d6eb097fabd",
    measurementId: "G-L8343W1KTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export Firestore database instance
export { db, analytics };