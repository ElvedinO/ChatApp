import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAHq-G9EesILv6biXGEdcAXSaYzQmhw3Pk',
  // apiKey: process.env.VITE_API_KEY,
  authDomain: 'chatapp-c308d.firebaseapp.com',
  projectId: 'chatapp-c308d',
  storageBucket: 'chatapp-c308d.appspot.com',
  messagingSenderId: '251142752789',
  appId: '1:251142752789:web:2ff795f2a14339ececdc1c',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
