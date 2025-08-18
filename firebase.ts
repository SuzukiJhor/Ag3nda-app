import Constants from 'expo-constants';
import { Platform } from 'react-native';

// SDK Web
import { getApps as getWebApps, initializeApp as initializeWebApp } from 'firebase/app';
import { getAuth as getWebAuth } from 'firebase/auth';
import { getFirestore as getWebFirestore } from 'firebase/firestore';

// SDK Nativo
import nativeFirebase from '@react-native-firebase/app';
import nativeAuth from '@react-native-firebase/auth';
import nativeFirestore from '@react-native-firebase/firestore';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const extra = Constants.expoConfig?.extra as FirebaseConfig;

let auth: any;
let db: any;

const firebaseConfig = {
  apiKey: extra.apiKey,
  authDomain: extra.authDomain,
  projectId: extra.projectId,
  storageBucket: extra.storageBucket,
  messagingSenderId: extra.messagingSenderId,
  appId: extra.appId,
  measurementId: extra.measurementId,
};

if (Platform.OS === 'web' || Constants.appOwnership === 'expo') {
  // Web / Expo Go
  if (!getWebApps().length) {
    initializeWebApp(firebaseConfig);
  }
  auth = getWebAuth();
  db = getWebFirestore();
} else {
  // Nativo
  if (!nativeFirebase.apps.length) {
    nativeFirebase.initializeApp(firebaseConfig);
  }
  auth = nativeAuth();
  db = nativeFirestore();
}

export { auth, db };

