// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAheMqSIfP9zP_o9WFwUm0MXT58XybWy3k",
  authDomain: "myfirstapp-7c7b0.firebaseapp.com",
  projectId: "myfirstapp-7c7b0",
  storageBucket: "myfirstapp-7c7b0.firebasestorage.app",
  messagingSenderId: "884462207115",
  appId: "1:884462207115:web:6e8616177c34dcbc32d48e",
  measurementId: "G-TLCYVZ4Q6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
