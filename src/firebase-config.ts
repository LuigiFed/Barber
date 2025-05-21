import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyCeXyj_076ZkShuFgj9kcaITjAexXZ1px8",
  authDomain: "prenotazioni-ec39b.firebaseapp.com",
  projectId: "prenotazioni-ec39b",
  storageBucket: "prenotazioni-ec39b.firebasestorage.app",
  messagingSenderId: "970253637316",
  appId: "1:970253637316:web:c724989289c2edbcc21b91",
  measurementId: "G-WSMZJEWREV"
};


export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
