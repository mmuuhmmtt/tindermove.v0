import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCpPnll5WxSQ3uugJi99n83ujya1c-oNBs',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'swipemovie-ac752.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'swipemovie-ac752',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'swipemovie-ac752.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '305914851008',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:305914851008:web:559c779feff43d852d8725'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)