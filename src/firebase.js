import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
<<<<<<< Updated upstream
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'fitscout-bdfa0.firebaseapp.com',
  projectId: 'fitscout-bdfa0',
  storageBucket: 'fitscout-bdfa0.firebasestorage.app',
  messagingSenderId: '840105195989',
  appId: '1:840105195989:web:133c2aa2456aeac0cca55c',
  measurementId: 'G-4XNQGJ2GZ1',
=======
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
>>>>>>> Stashed changes
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
<<<<<<< Updated upstream
export const googleProvider = new GoogleAuthProvider();
=======
export const provider = new GoogleAuthProvider();
>>>>>>> Stashed changes
export const db = getFirestore(app);