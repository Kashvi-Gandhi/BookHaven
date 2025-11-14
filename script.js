document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    const body = document.body;
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const noteModal = document.getElementById('note-modal');
    const bookReaderModal = document.getElementById('book-reader-modal');
    const highlightModal = document.getElementById('highlight-modal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    const categoryCards = document.querySelectorAll('.category-card');
    const previewBtns = document.querySelectorAll('.preview-btn');
    const rentBtns = document.querySelectorAll('.rent-btn');
    const buyBtns = document.querySelectorAll('.buy-btn');
    const continueReadingBtns = document.querySelectorAll('.continue-btn');
    const addNoteBtn = document.querySelector('.add-note-btn');
    const sliderControls = document.querySelectorAll('.slider-controls button');
    const audioBtns = document.querySelectorAll('.audio-btn');
    const highlightBtn = document.querySelector('.highlight-btn');
    const saveNoteBtn = document.querySelector('.save-note-btn');
    const pageNavBtns = document.querySelectorAll('.page-btn');
    const noteActionBtns = document.querySelectorAll('.note-actions button');

    // Current user state
    let currentUser = null;

    // Mock database
    const users = [];
    const notes = [
        {
            id: 1,
            content: "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.",
            bookTitle: "Harry Potter and the Prisoner of Azkaban",
            author: "J.K. Rowling"
        },
        {
            id: 2,
            content: "The only way out of the labyrinth of suffering is to forgive.",
            bookTitle: "Looking for Alaska",
            author: "John Green"
        }
    ];

    const books = [
        {
            id: 1,
            title: "The Silent Echo",
            author: "Jane Austen",
            rating: 4.5,
            category: "Novels",
            progress: 65,
            content: "This is the content of The Silent Echo. Multiple pages would be loaded here."
        },
        {
            id: 2,
            title: "Beyond the Horizon",
            author: "Mark Johnson",
            rating: 4.0,
            category: "Novels",
            progress: 0,
            content: "This is the content of Beyond the Horizon. Multiple pages would be loaded here."
        },
        {
            id: 3,
            title: "Whispers in the Dark",
            author: "Sarah Williams",
            rating: 5.0,
            category: "Novels",
            progress: 0,
            content: "This is the content of Whispers in the Dark. Multiple pages would be loaded here."
        },
        {
            id: 4,
            title: "The Philosopher's Journey",
            author: "Alan Watts",
            rating: 4.7,
            category: "Philosophy",
            progress: 0,
            content: "This is the content of The Philosopher's Journey. Multiple pages would be loaded here."
        },
        {
            id: 5,
            title: "Philosophical Investigations",
            author: "Ludwig Wittgenstein",
            rating: 4.3,
            category: "Philosophy",
            progress: 35,
            content: "This is the content of Philosophical Investigations. Multiple pages would be loaded here."
        },
        {
            id: 6,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            rating: 4.8,
            category: "Novels",
            audioProgress: 42,
            content: "This is the content of The Great Gatsby. Multiple pages would be loaded here."
        },
        {
            id: 7,
            title: "Meditations",
            author: "Marcus Aurelius",
            rating: 4.9,
            category: "Philosophy",
            audioProgress: 78,
            content: "This is the content of Meditations. Multiple pages would be loaded here."
        }
    ];

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });

    // Modal functionality
    function openModal(modal) {
        modal.style.display = 'flex';
        body.classList.add('modal-open');
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        body.classList.remove('modal-open');
    }

    loginBtn.addEventListener('click', function() {
        openModal(loginModal);
    });

    signupBtn.addEventListener('click', function() {
        openModal(signupModal);
    });

    addNoteBtn.addEventListener('click', function() {
        const userLoggedIn = localStorage.getItem('userLoggedIn');
        if (userLoggedIn === 'true') {
            window.location.href = 'notes.html';
        } else {
            alert('Please login to access notes.');
            openModal(loginModal);
        }
    });

    closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    // Form submissions
    const loginForm = loginModal.querySelector('form');
    const signupForm = signupModal.querySelector('form');
    const noteForm = noteModal.querySelector('form');
    const highlightForm = highlightModal.querySelector('form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = this.querySelector('#email').value;
        const password = this.querySelector('#password').value;

        // Find user in mock database
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            currentUser = user;
            updateUIAfterLogin();
            closeModal(loginModal);
        }
    });

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = this.querySelector('#name').value;
        const email = this.querySelector('#email').value;
        const password = this.querySelector('#password').value;

        // Check if user already exists
        if (users.some(u => u.email === email)) {
            return;
        }

        // Add new user to mock database
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password,
            books: [],
            notes: []
        };

        users.push(newUser);
        currentUser = newUser;
        updateUIAfterLogin();
        closeModal(signupModal);
    });

    noteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const noteText = this.querySelector('#note-text').value;

        if (noteText.trim() === '') {
            return;
        }

        addNote({
            id: notes.length + 1,
            content: noteText,
            bookTitle: 'Manual Entry',
            author: 'User'
        });

        this.reset();
        closeModal(noteModal);
    });

    highlightForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const highlightedText = this.querySelector('#highlighted-text').value;
        const comment = this.querySelector('#note-comment').value;

        if (highlightedText.trim() === '') {
            return;
        }

        const currentBookTitle = document.getElementById('reader-book-title').textContent;
        const currentBook = books.find(book => book.title === currentBookTitle);

        addNote({
            id: notes.length + 1,
            content: highlightedText + (comment ? '\n\nComment: ' + comment : ''),
            bookTitle: currentBookTitle,
            author: currentBook ? currentBook.author : 'Unknown'
        });

        this.reset();
        closeModal(highlightModal);
    });

    // Function to update UI after login
    function updateUIAfterLogin() {
        const authButtons = document.querySelector('.auth-buttons');
        authButtons.innerHTML = `
            <div class="user-profile">
                <span>Welcome, ${currentUser.name}</span>
                <button class="logout-btn">Logout</button>
            </div>
        `;

        const logoutBtn = document.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', function() {
            currentUser = null;
            authButtons.innerHTML = `
                <button class="login-btn">Login</button>
                <button class="signup-btn">Sign Up</button>
            `;
            // Reattach event listeners
            document.querySelector('.login-btn').addEventListener('click', function() {
                openModal(loginModal);
            });
            document.querySelector('.signup-btn').addEventListener('click', function() {
                openModal(signupModal);
            });
        });
    }

    // Function to add a note
    function addNote(note) {
        notes.push(note);

        // Update the UI
        const notesList = document.querySelector('.notes-list');
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
            <div class="note-content">
                <p>${note.content}</p>
            </div>
            <div class="note-source">
                <span class="book-title">${note.bookTitle}</span>
                <span class="author">- ${note.author}</span>
            </div>
            <div class="note-actions">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;

        notesList.appendChild(noteCard);

        // Add event listeners to new note's buttons
        const editBtn = noteCard.querySelector('.edit-btn');
        const deleteBtn = noteCard.querySelector('.delete-btn');

        editBtn.addEventListener('click', function() {
            const noteContent = noteCard.querySelector('.note-content p').textContent;
            openEditNoteModal(note.id, noteContent);
        });

        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this note?')) {
                const index = notes.findIndex(n => n.id === note.id);
                if (index !== -1) {
                    notes.splice(index, 1);
                    noteCard.remove();
                }
            }
        });
    }

    // Function to open edit note modal
    function openEditNoteModal(noteId, content) {
        // Create modal on the fly
        const editModal = document.createElement('div');
        editModal.className = 'modal';
        editModal.id = 'edit-note-modal';
        editModal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h2>Edit Note</h2>
                <form id="edit-note-form">
                    <label for="edit-note-text">Note:</label>
                    <textarea id="edit-note-text" name="edit-note-text" rows="4" required>${content}</textarea>
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        `;

        document.body.appendChild(editModal);
        openModal(editModal);

        // Add event listeners
        const closeBtn = editModal.querySelector('.close-btn');
        closeBtn.addEventListener('click', function() {
            closeModal(editModal);
            document.body.removeChild(editModal);
        });

        const editForm = editModal.querySelector('#edit-note-form');
        editForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newContent = this.querySelector('#edit-note-text').value;

            // Update note in mock database
            const note = notes.find(n => n.id === noteId);
            if (note) {
                note.content = newContent;

                // Update UI
                const noteCards = document.querySelectorAll('.note-card');
                const noteCard = Array.from(noteCards).find(card => {
                    const bookTitle = card.querySelector('.book-title').textContent;
                    return bookTitle === note.bookTitle;
                });

                if (noteCard) {
                    noteCard.querySelector('.note-content p').textContent = newContent;
                }
            }

            closeModal(editModal);
            document.body.removeChild(editModal);
        });
    }

    // Book reader functionality
    let currentBook = null;
    let currentPage = 1;
    const totalPages = 15; // Mock total pages

    function openBookReader(book) {
        if (!book) return;

        currentBook = book;
        currentPage = 1;

        document.getElementById('reader-book-title').textContent = book.title;
        document.getElementById('current-page').textContent = currentPage;
        document.getElementById('total-pages').textContent = totalPages;

        // Update page content
        document.getElementById('page-1').innerHTML = `
            <p>This is a preview of the book "${book.title}" by ${book.author}. Only 10-15 pages are available for online reading. To continue reading, please rent or purchase this book.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet justo sit amet nisi tincidunt tincidunt. Aliquam ut nibh ut enim ullamcorper mollis. Aliquam vehicula, ligula non tempor faucibus, metus sem pretium urna, vel egestas metus purus quis metus.</p>
            <p>Nullam pharetra diam tortor, eu vulputate est feugiat a. Mauris vel est ut velit scelerisque lacinia. Morbi vehicula velit ac lacus elementum, id maximus turpis ultrices. In arcu justo, interdum sit amet quam in, tempus elementum erat.</p>
        `;

        openModal(bookReaderModal);
    }

    // Event listeners for book interaction
    previewBtns.forEach(function(btn, index) {
        btn.addEventListener('click', function() {
            const book = books[index];
            openBookReader(book);
        });
    });

    rentBtns.forEach(function(btn, index) {
        btn.addEventListener('click', function() {
            if (currentUser) {
                // Add book to user's rented books
            } else {
                openModal(loginModal);
            }
        });
    });

    buyBtns.forEach(function(btn, index) {
        btn.addEventListener('click', function() {
            if (currentUser) {
                // Add book to user's purchased books
            } else {
                openModal(loginModal);
            }
        });
    });

    continueReadingBtns.forEach(function(btn, index) {
        btn.addEventListener('click', function() {
            const cardTitle = btn.closest('.reading-card').querySelector('h3').textContent;
            const book = books.find(book => book.title === cardTitle);
            if (book) {
                openBookReader(book);
            }
        });
    });

    // Page navigation
    pageNavBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (btn.classList.contains('prev')) {
                if (currentPage > 1) {
                    currentPage--;
                }
            } else if (btn.classList.contains('next')) {
                if (currentPage < totalPages) {
                    currentPage++;
                }
            }

            document.getElementById('current-page').textContent = currentPage;

            // In a real app, you would load the content for the specific page
            // For this mock, we'll just update the page number
        });
    });

    // Highlight functionality
    highlightBtn.addEventListener('click', function() {
        // Get selected text
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (selectedText.trim() === '') {
            return;
        }

        // Put selected text in the highlight modal
        document.getElementById('highlighted-text').value = selectedText;
        openModal(highlightModal);
    });

    // Save note from reader
    saveNoteBtn.addEventListener('click', function() {
        if (currentUser) {
            const selection = window.getSelection();
            const selectedText = selection.toString();

            if (selectedText.trim() === '') {
                openModal(noteModal);
            } else {
                document.getElementById('highlighted-text').value = selectedText;
                openModal(highlightModal);
            }
        } else {
            openModal(loginModal);
        }
    });

    // Book slider functionality
    let currentSlide = 0;
    const bookCards = document.querySelectorAll('.book-card');
    const totalSlides = bookCards.length - 1;

    sliderControls.forEach(function(btn, index) {
        btn.addEventListener('click', function() {
            if (index === 0) {
                // Previous button
                currentSlide = (currentSlide > 0) ? currentSlide - 1 : 0;
            } else {
                // Next button
                currentSlide = (currentSlide < totalSlides - 3) ? currentSlide + 1 : totalSlides - 3;
            }

            const slider = document.querySelector('.book-slider');
            const cardWidth = bookCards[0].offsetWidth;
            const margin = 20; // Margin between cards

            slider.style.transform = `translateX(-${currentSlide * (cardWidth + margin)}px)`;
        });
    });

    // Audio player functionality
    audioBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (btn.classList.contains('play')) {
                const playIcon = btn.querySelector('i');
                if (playIcon.classList.contains('fa-play')) {
                    playIcon.classList.remove('fa-play');
                    playIcon.classList.add('fa-pause');
                } else {
                    playIcon.classList.remove('fa-pause');
                    playIcon.classList.add('fa-play');
                }
            }
            // Other audio controls would have actual functionality in a real app
        });
    });

    // Category navigation
    categoryCards.forEach(function(card) {
        card.addEventListener('click', function() {
            const category = card.querySelector('h3').textContent;
            // Skip for audiobooks as it has its own login check
            if (category !== 'Audiobooks') {
                // In a real app, this would filter books by category
            }
        });
    });

    // Note actions
    noteActionBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const noteCard = btn.closest('.note-card');
            const noteContent = noteCard.querySelector('.note-content p').textContent;
            const noteSource = noteCard.querySelector('.note-source .book-title').textContent;

            if (btn.querySelector('i').classList.contains('fa-edit')) {
                // Find the corresponding note in the mock database
                const note = notes.find(n => n.bookTitle === noteSource && n.content === noteContent);
                if (note) {
                    openEditNoteModal(note.id, noteContent);
                }
            } else if (btn.querySelector('i').classList.contains('fa-trash-alt')) {
                if (confirm('Are you sure you want to delete this note?')) {
                    // Find the corresponding note in the mock database
                    const index = notes.findIndex(n => n.bookTitle === noteSource && n.content === noteContent);
                    if (index !== -1) {
                        notes.splice(index, 1);
                        noteCard.remove();
                    }
                }
            }
        });
    });

    // Navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.textContent;

            // Simulate navigation
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // In a real app, this would load different content based on the link
            if (target === 'Home') {
                // Already on home
            } else if (target === 'Browse') {
                // Browse all books
            } else if (target === 'Categories') {
                // Scroll to categories section
                document.querySelector('.categories').scrollIntoView({ behavior: 'smooth' });
            } else if (target === 'My Library') {
                if (currentUser) {
                    // Scroll to continue reading section
                    document.querySelector('.continue-reading').scrollIntoView({ behavior: 'smooth' });
                } else {
                    openModal(loginModal);
                }
            } else if (target === 'Notes') {
                // Scroll to notes section
                document.querySelector('.notes-section').scrollIntoView({ behavior: 'smooth' });
            } else if (target === 'Audiobooks') {
                // Scroll to audiobooks section
                document.querySelector('.audiobooks').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Footer links
    const footerLinks = document.querySelectorAll('.footer-section.links a');
    footerLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.textContent;

            // Simulate navigation (same as nav links)
            if (target === 'Home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (target === 'Browse') {
                // Browse all books
            } else if (target === 'Categories') {
                document.querySelector('.categories').scrollIntoView({ behavior: 'smooth' });
            } else if (target === 'My Library') {
                if (currentUser) {
                    document.querySelector('.continue-reading').scrollIntoView({ behavior: 'smooth' });
                } else {
                    openModal(loginModal);
                }
            } else if (target === 'Notes') {
                document.querySelector('.notes-section').scrollIntoView({ behavior: 'smooth' });
            } else if (target === 'Audiobooks') {
                document.querySelector('.audiobooks').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Social media links
    const socialLinks = document.querySelectorAll('.social-icons a');
    socialLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const platform = this.querySelector('i').className.split(' ')[1].split('-')[1];
            // In a real app, this would redirect to social media platforms
        });
    });

    // Search functionality
    const searchBar = document.querySelector('.search-bar');
    const searchInput = searchBar.querySelector('input');
    const searchButton = searchBar.querySelector('button');

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query !== '') {
            // In a real app, this would search the book database
            searchInput.value = '';
        }
    });

    // Enable search on Enter key
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    // Add CSS for slider
    const style = document.createElement('style');
    style.textContent = `
        .book-slider {
            display: flex;
            transition: transform 0.5s ease;
            margin-bottom: 20px;
        }

        .book-card {
            flex: 0 0 auto;
            margin-right: 20px;
        }

        .modal-open {
            overflow: hidden;
        }

        .user-profile {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logout-btn {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
        }

        .logout-btn:hover {
            background-color: #c82333;
        }

        @media (max-width: 768px) {
            nav ul {
                display: none;
                position: absolute;
                top: 60px;
                left: 0;
                right: 0;
                background-color: #fff;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 100;
            }

            nav ul.show {
                display: block;
            }

            nav ul li {
                display: block;
                margin: 0;
                padding: 10px 20px;
                border-bottom: 1px solid #eee;
            }

            nav ul li:last-child {
                border-bottom: none;
            }
        }
    `;
    document.head.appendChild(style);
});