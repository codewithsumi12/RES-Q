// src/firebase/config.js
// Replace these with your actual Firebase project credentials
// Get them from: https://console.firebase.google.com/

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "your-app.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "your-app.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123:web:abc123",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://your-app-default-rtdb.firebaseio.com"
};

// Google Maps API Key
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";

// Razorpay Key
export const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_YOUR_KEY";
