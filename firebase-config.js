// firebase-config.js - using Firebase Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCz-ZKoQ2iy_t6SmXOY2ur3HZ605Rm3kRQ",
  authDomain: "bikari-440.firebaseapp.com",
  projectId: "bikari-440",
  storageBucket: "bikari-440.firebasestorage.app",
  messagingSenderId: "832137071308",
  appId: "1:832137071308:web:a0a825c45d437843539069",
  measurementId: "G-DY5FS3YFXF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
