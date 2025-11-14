// Firebase Firestore cloud storage for notes
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcNbxJ0EKWagsIW38TORE02cwKykBTSNc",
    authDomain: "online-library-cd2dc.firebaseapp.com",
    databaseURL: "https://online-library-cd2dc-default-rtdb.firebaseio.com",
    projectId: "online-library-cd2dc",
    storageBucket: "online-library-cd2dc.firebasestorage.app",
    messagingSenderId: "303000110572",
    appId: "1:303000110572:web:1393b8555ad2789e572cc9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Cloud notes manager
window.CloudNotes = {
    // Save notes to cloud
    async saveToCloud(notes) {
        const userData = AuthState.getUserData();
        if (!userData || !userData.uid) return false;
        
        try {
            const docRef = doc(db, 'userNotes', userData.uid);
            await setDoc(docRef, {
                notes: notes,
                lastUpdated: new Date().toISOString(),
                userId: userData.uid
            });
            return true;
        } catch (error) {
            console.error('Error saving notes to cloud:', error);
            return false;
        }
    },
    
    // Load notes from cloud
    async loadFromCloud() {
        const userData = AuthState.getUserData();
        if (!userData || !userData.uid) return [];
        
        try {
            const docRef = doc(db, 'userNotes', userData.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                return data.notes || [];
            }
            return [];
        } catch (error) {
            console.error('Error loading notes from cloud:', error);
            return [];
        }
    }
};