// Firebase configuration and authentication setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Your Firebase configuration - using the one you provided
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
const auth = getAuth(app);

// Set up social login providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Save user data to localStorage
function saveUserData(user) {
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    photoURL: user.photoURL || null,
    lastLogin: new Date().toISOString()
  };
  
  localStorage.setItem('userData', JSON.stringify(userData));
  localStorage.setItem('userLoggedIn', 'true');
  
  return userData;
}

// Handle successful login
function handleSuccessfulLogin(user) {
  const userData = saveUserData(user);
  console.log('User logged in successfully:', userData);
  
  // Redirect to index.html with login status in URL params
  window.location.href = "index.html?login=success&uid=" + userData.uid;
}

// Check for redirect result - handles case when user returns from popup/redirect flow
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      // User successfully authenticated via redirect
      handleSuccessfulLogin(result.user);
    }
  })
  .catch((error) => {
    if (error.code !== 'auth/no-auth-event') { // Ignore if there's no redirect result
      console.error('Redirect error:', error);
      showError('Authentication error: ' + error.message);
    }
  });

// Get form elements
const loginForm = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const resetPasswordLink = document.querySelector('.forgot-password');

// Function to display error messages
function showError(message) {
  // Remove any existing error messages
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  const errorDiv = document.createElement('div');
  errorDiv.style.color = 'red';
  errorDiv.style.marginBottom = '10px';
  errorDiv.style.fontSize = '14px';
  errorDiv.textContent = message;
  errorDiv.classList.add('error-message');
  
  loginForm.insertBefore(errorDiv, document.querySelector('.btn-login'));
}

// Email/Password login
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!email || !password) {
    showError('Please enter both email and password');
    return;
  }
  
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      handleSuccessfulLogin(userCredential.user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      
      if (errorCode === 'auth/invalid-email') {
        showError('Invalid email format');
      } else if (errorCode === 'auth/user-not-found') {
        showError('No account found with this email');
      } else if (errorCode === 'auth/wrong-password') {
        showError('Incorrect password');
      } else {
        showError('Login failed: ' + errorMessage);
      }
      
      console.error('Login error:', errorCode, errorMessage);
    });
});

// Google login with fallback to redirect if popup is blocked
const googleLoginBtn = document.getElementById('google-login-btn');
googleLoginBtn.addEventListener('click', function() {
  const usingMobile = window.innerWidth < 768; // Check if user is on a mobile device
  
  if (usingMobile) {
    // Use redirect for mobile devices to prevent popup issues
    signInWithRedirect(auth, googleProvider);
  } else {
    // Try popup first, fall back to redirect if popup is blocked
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // Handle successful login
        handleSuccessfulLogin(result.user);
      })
      .catch((error) => {
        console.error('Google login error:', error.code, error.message);
        
        // Check if popup was blocked
        if (error.code === 'auth/popup-blocked') {
          // Fall back to redirect method
          signInWithRedirect(auth, googleProvider);
        } else if (error.code === 'auth/popup-closed-by-user') {
          showError('Sign-in was cancelled. Please try again.');
        } else {
          showError('Google login failed: ' + error.message);
        }
      });
  }
});

// Facebook login
const facebookLoginBtn = document.querySelector('.btn-facebook');
facebookLoginBtn.addEventListener('click', function() {
  // Facebook login is not fully configured yet
});

// Apple login
const appleLoginBtn = document.querySelector('.btn-apple');
appleLoginBtn.addEventListener('click', function() {
  // Apple login is not fully configured yet
});

// Twitter login
const twitterLoginBtn = document.querySelector('.btn-twitter');
twitterLoginBtn.addEventListener('click', function() {
  // Twitter login is not fully configured yet
});

// Forgot password functionality
resetPasswordLink.addEventListener('click', function(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  
  if (!email) {
    showError('Please enter your email address first');
    return;
  }
  
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      
      if (errorCode === 'auth/invalid-email') {
        showError('Invalid email format');
      } else if (errorCode === 'auth/user-not-found') {
        showError('No account found with this email');
      } else {
        showError('Failed to send reset email: ' + errorMessage);
      }
      
      console.error('Reset password error:', errorCode, errorMessage);
    });
});

// Check if user is already logged in (but don't auto-redirect to allow account switching)
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in - just save the data without redirecting
    saveUserData(user);
  }
});