import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyApy-6P6wctARMhBZMeea6AE0KxvjklLsQ",
  authDomain: "esp32-b35c8.firebaseapp.com",
  databaseURL: "https://esp32-b35c8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "esp32-b35c8",
  storageBucket: "esp32-b35c8.appspot.com",
  messagingSenderId: "47343608336",
  appId: "1:47343608336:web:2896e196cdf3f2b8616095"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export default app;

