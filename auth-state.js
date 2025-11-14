// Global authentication state manager
window.AuthState = {
    // Check if user is logged in
    isLoggedIn: function() {
        return localStorage.getItem('userLoggedIn') === 'true' && localStorage.getItem('userData');
    },
    
    // Get user data
    getUserData: function() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },
    
    // Update UI based on login state
    updateUI: function() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) return;
        
        if (this.isLoggedIn()) {
            const userData = this.getUserData();
            authButtons.innerHTML = `
                <div class="user-profile">
                    <span>Welcome, ${userData.displayName || userData.email.split('@')[0]}</span>
                    <button class="logout-btn" onclick="AuthState.logout()">Logout</button>
                </div>
            `;
        } else {
            authButtons.innerHTML = `
                <button class="login-btn" onclick="window.location.href='login.html'">Login</button>
                <button class="signup-btn" onclick="window.location.href='signup.html'">Sign Up</button>
            `;
        }
    },
    
    // Save user notes (cloud + local backup)
    saveUserNotes: async function(notes) {
        const userData = this.getUserData();
        if (userData && userData.uid) {
            // Save to local storage as backup
            localStorage.setItem(`notes_${userData.uid}`, JSON.stringify(notes));
            
            // Save to cloud if available
            if (window.CloudNotes) {
                await window.CloudNotes.saveToCloud(notes);
            }
        }
    },
    
    // Load user notes (cloud first, then local backup)
    loadUserNotes: async function() {
        const userData = this.getUserData();
        if (userData && userData.uid) {
            // Try to load from cloud first
            if (window.CloudNotes) {
                try {
                    const cloudNotes = await window.CloudNotes.loadFromCloud();
                    if (cloudNotes && cloudNotes.length > 0) {
                        // Update local backup with cloud data
                        localStorage.setItem(`notes_${userData.uid}`, JSON.stringify(cloudNotes));
                        return cloudNotes;
                    }
                } catch (error) {
                    console.log('Cloud load failed, using local backup');
                }
            }
            
            // Fallback to local storage
            const notes = localStorage.getItem(`notes_${userData.uid}`);
            return notes ? JSON.parse(notes) : [];
        }
        return [];
    },
    
    // Logout function
    logout: function() {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userData');
        this.updateUI();
        // Redirect to home if on protected page
        if (window.location.pathname.includes('notes.html')) {
            window.location.href = 'index.html';
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    AuthState.updateUI();
});