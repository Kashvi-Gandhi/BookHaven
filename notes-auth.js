// Login protection for notes.html
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const userData = localStorage.getItem('userData');
    
    if (!userLoggedIn || userLoggedIn !== 'true' || !userData) {
        // User is not logged in, show alert and redirect
        alert('Please login to access notes.');
        window.location.href = 'login.html';
        return;
    }
    
    // User is logged in, allow access to the page
    console.log('User authenticated, allowing access to notes page');
});