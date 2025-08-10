import { initializeApp } from 'firebase/app'
import { signInAnonymously, onAuthStateChanged, initializeAuth, getReactNativePersistence, User } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
export const db = getFirestore(app)
export { auth }

export const ensureAnonSignIn = async (): Promise<User> => {
  if (auth.currentUser) return auth.currentUser as User
  const { user } = await signInAnonymously(auth)
  return user
}

export const watchAuth = (cb: (u: User | null) => void) => onAuthStateChanged(auth, cb)
