import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'fitscout-bdfa0.firebaseapp.com',
  projectId: 'fitscout-bdfa0',
  storageBucket: 'fitscout-bdfa0.firebasestorage.app',
  messagingSenderId: '840105195989',
  appId: '1:840105195989:web:133c2aa2456aeac0cca55c',
  measurementId: 'G-4XN0GJZGZ1',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;