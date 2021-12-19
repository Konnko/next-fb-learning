// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore, serverTimestamp } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
}

const firebase = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const serverTS = serverTimestamp
export const googleAuthProvider = new GoogleAuthProvider()
export const auth = getAuth(firebase)
export const firestore = getFirestore(firebase)
export const storage = getStorage(firebase)
