// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore, serverTimestamp } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const fbConfig = {
  apiKey: process.env.API_KEY + "",
  authDomain: process.env.AUTH_DOMAIN + "",
  projectId: process.env.PROJECT_ID + "",
  storageBucket: process.env.STORAGE_BUCKET + "",
  messagingSenderId: process.env.MESSAGING_SENDER_ID + "",
  appId: process.env.APP_ID + "",
  measurementId: process.env.MEASUREMENT_ID + ""
}

const app = getApps().length ? getApp() : initializeApp(fbConfig)

export const serverTS = serverTimestamp
export const googleAuthProvider = new GoogleAuthProvider()
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)
