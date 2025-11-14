// firebase-notes.js
class FirebaseNotesManager extends NotesManager {
    constructor() {
        super();
        this.userId = null;
        this.initFirebase();
    }

    async initFirebase() {
        // Wait for Firebase auth to initialize
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.userId = user.uid;
                this.loadNotesFromFirebase();
            } else {
                this.userId = null;
                // Fall back to local storage
                this.notes = this.loadNotes();
            }
        });
    }

    async loadNotesFromFirebase() {
        if (!this.userId) return;

        try {
            const docRef = doc(db, 'userNotes', this.userId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                this.notes = docSnap.data().notes || [];
            } else {
                // Create new document for user
                await setDoc(docRef, { notes: this.notes });
            }
        } catch (error) {
            console.error('Error loading notes from Firebase:', error);
            // Fall back to local storage
            this.notes = this.loadNotes();
        }
    }

    async saveNotes() {
        // Save to local storage first
        const localSuccess = super.saveNotes();
        
        // Also save to Firebase if user is logged in
        if (this.userId) {
            try {
                const docRef = doc(db, 'userNotes', this.userId);
                await setDoc(docRef, { 
                    notes: this.notes,
                    lastUpdated: new Date().toISOString()
                });
                return true;
            } catch (error) {
                console.error('Error saving notes to Firebase:', error);
                return localSuccess;
            }
        }
        
        return localSuccess;
    }
}