import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyArHDS5OCgYDYO4CnvgZSxhum75cwzm7IE",
  authDomain: "pdfnugget.firebaseapp.com",
  projectId: "pdfnugget",
  storageBucket: "pdfnugget.appspot.com",
  messagingSenderId: "804930608167",
  appId: "1:804930608167:web:e19d3cafe63a20fe8c8202",
  measurementId: "G-SFP3MPYLMT"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig): getApp(); 

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage }