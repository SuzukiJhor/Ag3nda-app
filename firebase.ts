// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBi-xMV9YcINXEtLpykuPlrsW-hjWurVF0',
  authDomain: 'agendala-68714.firebaseapp.com',
  projectId: 'agendala-68714',
  storageBucket: 'agendala-68714.appspot.com',
  messagingSenderId: '600695293831',
  appId: '1:600695293831:web:129d0e445d834fd8837522',
  measurementId: 'G-PZCF664R7K',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
