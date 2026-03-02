import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp, writeBatch, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app = null;
let auth = null;
let db = null;
let provider = null;
let isFirebaseEnabled = false;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    provider = new GoogleAuthProvider();
    isFirebaseEnabled = true;
    console.log("Firebase and OAuth services initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed. Services will not load.", error);
  }
} else {
  const error = new Error("Missing VITE_FIREBASE_API_KEY in environment variables.");
  console.warn("Firebase and OAuth services did not load.", error);
}

const SCORES_COLLECTION = 'itd_scores'; // game (full details) : write only
const LEADERBOARD_COLLECTION = 'itd_leaderboard'; // topscores (minimum details) : read/write

export { 
  auth, 
  db, 
  provider, 
  signInWithPopup, 
  onAuthStateChanged, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  isFirebaseEnabled,
  writeBatch, 
  doc,
  SCORES_COLLECTION,
  LEADERBOARD_COLLECTION
};
