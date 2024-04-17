// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const FirebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: `${FirebaseApiKey}`,
  authDomain: "estateease-ab1a1.firebaseapp.com",
  projectId: "estateease-ab1a1",
  storageBucket: "estateease-ab1a1.appspot.com",
  messagingSenderId: "589274729634",
  appId: "1:589274729634:web:4f19348721310339a49bfb",
  measurementId: "G-K356ZGWFPB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);