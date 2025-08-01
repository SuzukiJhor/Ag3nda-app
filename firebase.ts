import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyA1B2C3D4E5F6G7H8I9J0KLMNOPQRST",
  authDomain: "meu-app-firebase.firebaseapp.com",
  projectId: "meu-app-firebase",
  storageBucket: "meu-app-firebase.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
  measurementId: "G-ABCDEFGHJK",
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
