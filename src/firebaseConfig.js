// - NOVO - 
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Substitua pelos valores do seu projeto Firebase
const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: "https://natal-rifa-default-rtdb.firebaseio.com",
    projectId: "natal-rifa",
    storageBucket: "natal-rifa.firebasestorage.app",
    messagingSenderId: "264998789508",
    appId: "1:264998789508:web:81675bb013343c20b97dd1",
    measurementId: "G-TZYC663P9P"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços do Firebase
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
