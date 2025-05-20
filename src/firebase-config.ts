// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeXyj_076ZkShuFgj9kcaITjAexXZ1px8",
  authDomain: "prenotazioni-ec39b.firebaseapp.com",
  projectId: "prenotazioni-ec39b",
  storageBucket: "prenotazioni-ec39b.firebasestorage.app",
  messagingSenderId: "970253637316",
  appId: "1:970253637316:web:c724989289c2edbcc21b91",
  measurementId: "G-WSMZJEWREV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
