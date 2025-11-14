// Firebase configuration and authentication setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Your Firebase configuration
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

// Check for redirect result
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      // User successfully authenticated via redirect
      console.log('User registered via redirect:', result.user);
      window.location.href = "index.html";
    }
  })
  .catch((error) => {
    if (error.code !== 'auth/no-auth-event') {
      console.error('Redirect error:', error);
      showError('Authentication error: ' + error.message);
    }
  });

// Get form elements
const signupForm = document.getElementById('signup-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('submit');

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
  
  submitButton.insertAdjacentElement('beforebegin', errorDiv);
}

// Email/Password signup
submitButton.addEventListener('click', function(e) {
  e.preventDefault();
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!name) {
    showError('Please enter your full name');
    return;
  }
  
  if (!email) {
    showError('Please enter your email');
    return;
  }
  
  if (!password) {
    showError('Please create a password');
    return;
  }
  
  if (password.length < 6) {
    showError('Password must be at least 6 characters');
    return;
  }
  
  // Register the user
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      
      // Update profile with the name
      return updateProfile(user, {
        displayName: name
      }).then(() => {
        console.log('User registered:', user);
        window.location.href = "index.html";
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      
      if (errorCode === 'auth/email-already-in-use') {
        showError('This email is already registered');
      } else if (errorCode === 'auth/invalid-email') {
        showError('Invalid email format');
      } else if (errorCode === 'auth/weak-password') {
        showError('Password is too weak. Use at least 6 characters.');
      } else {
        showError('Registration failed: ' + errorMessage);
      }
      
      console.error('Signup error:', errorCode, errorMessage);
    });
});

// Social sign-up handler function
function handleSocialSignup(provider, providerName) {
  const usingMobile = window.innerWidth < 768;
  
  if (usingMobile) {
    signInWithRedirect(auth, provider);
  } else {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(`User registered with ${providerName}:`, result.user);
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error(`${providerName} signup error:`, error);
        
        if (error.code === 'auth/popup-blocked') {
          signInWithRedirect(auth, provider);
        } else if (error.code === 'auth/popup-closed-by-user') {
          showError('Sign-up was cancelled. Please try again.');
        } else {
          showError(`${providerName} signup failed: ${error.message}`);
        }
      });
  }
}

// Set up social signup buttons
document.querySelector('.social-icon[title="Sign up with Google"]').addEventListener('click', () => {
  handleSocialSignup(googleProvider, 'Google');
});

document.querySelector('.social-icon[title="Sign up with Facebook"]').addEventListener('click', () => {
  // Facebook signup is not fully configured yet
});

document.querySelector('.social-icon[title="Sign up with Instagram"]').addEventListener('click', () => {
  // Instagram signup is not fully configured yet
});