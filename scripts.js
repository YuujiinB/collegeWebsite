document.addEventListener('DOMContentLoaded', function() {
    // Set active nav link
    const currentPage = location.pathname.split('/').pop();
    document.querySelectorAll('.nav-links a').forEach(link => {
        if(link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if(window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Animate elements on scroll
    const animateOnScroll = () => {
        document.querySelectorAll('.feature').forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            const isVisible = (elTop < window.innerHeight * 0.9);
            if(isVisible) el.style.opacity = '1';
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Quiz functionality
    if(document.querySelector('.quiz-container')) {
        let currentQuestion = 0;
        const questions = document.querySelectorAll('.question');
        const progressBar = document.querySelector('.quiz-progress-bar');

        function showQuestion(index) {
            questions.forEach((q, i) => {
                q.classList.toggle('active', i === index);
            });
            progressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
        }

        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentQuestion++;
                if(currentQuestion < questions.length) {
                    showQuestion(currentQuestion);
                } else {
                    window.location.href = 'results.html';
                }
            });
        });

        showQuestion(0);
    }

    // Load therapists
    if(document.getElementById('therapists-container')) {
        fetch('data/therapists.json')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('therapists-container');
                data.therapists.forEach(therapist => {
                    const therapistHTML = `
                        <div class="feature">
                            <img src="${therapist.image}" alt="${therapist.name}">
                            <h2>${therapist.name}</h2>
                            <p><strong>Specialty:</strong> ${therapist.specialty}</p>
                            <p>${therapist.bio}</p>
                            <a href="appointments.html?therapist=${therapist.id}" class="btn">Book Session</a>
                        </div>
                    `;
                    container.innerHTML += therapistHTML;
                });
            });
    }
});

// Admin Login Functionality
if(document.getElementById('adminLoginForm')) {
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const adminId = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        
        // Simulated admin login (replace with real authentication)
        if(adminId === "admin@wellness" && password === "SecurePass123!") {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin.html';
        } else {
            alert('Invalid admin credentials!');
        }
    });
}

// Admin Dashboard Functionality
if(document.querySelector('.admin-dashboard')) {
    // Check admin login status
    if(!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin-login.html';
    }

    // Modal Handling
    window.showModal = function(type) {
        const modal = document.getElementById('adminModal');
        const content = document.getElementById('modalContent');
        
        let html = '';
        switch(type) {
            case 'add-therapist':
                html = `<h3>Add New Therapist</h3>
                        <form class="admin-form">
                            <input type="text" placeholder="Full Name" required>
                            <input type="email" placeholder="Email" required>
                            <input type="text" placeholder="Specialization" required>
                            <button class="btn">Add Therapist</button>
                        </form>`;
                break;
            case 'edit-therapist':
                html = `<h3>Edit Therapist</h3>...`;
                break;
            // Add other cases
        }
        
        content.innerHTML = html;
        modal.style.display = 'block';
    }

    window.closeModal = function() {
        document.getElementById('adminModal').style.display = 'none';
    }

    // Close modal on outside click
    window.onclick = function(event) {
        const modal = document.getElementById('adminModal');
        if(event.target === modal) {
            modal.style.display = 'none';
        }
    }
}

// Logout Functionality
if(document.querySelector('[href="logout.html"]')) {
    document.querySelector('[href="logout.html"]').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'index.html';
    });
}

// Add to existing scripts

// Authentication check
function checkAuth() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Login/Register Form Handling (add to existing form submit handlers)
document.querySelectorAll('.auth-form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Your existing validation
        
        // On successful login/registration
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect back to appointments if coming from booking attempt
        const returnUrl = new URLSearchParams(window.location.search).get('return');
        if(returnUrl) {
            window.location.href = returnUrl;
        } else {
            window.location.href = 'index.html';
        }
    });
});

// Appointment Page Logic (update existing code)
if(document.querySelector('.appointment-system')) {
    const confirmBtn = document.querySelector('.confirm-btn');
    
    confirmBtn.addEventListener('click', function() {
        if(!checkAuth()) {
            // Store selected appointment temporarily
            const appointmentData = {
                date: document.getElementById('appointmentDate').value,
                time: document.querySelector('.time-slot.selected')?.textContent
            };
            
            localStorage.setItem('pendingAppointment', JSON.stringify(appointmentData));
            
            // Redirect to login with return URL
            window.location.href = `login.html?return=${encodeURIComponent('appointments.html')}`;
            return;
        }
        
        // Proceed with booking if authenticated
        bookAppointment();
    });

    // Check for pending appointment on page load
    const pendingAppointment = JSON.parse(localStorage.getItem('pendingAppointment'));
    if(pendingAppointment && checkAuth()) {
        document.getElementById('appointmentDate').value = pendingAppointment.date;
        generateTimeSlots();
        
        // Select the previously chosen time after slots load
        setTimeout(() => {
            const slots = document.querySelectorAll('.time-slot');
            slots.forEach(slot => {
                if(slot.textContent === pendingAppointment.time) {
                    slot.click();
                }
            });
            localStorage.removeItem('pendingAppointment');
        }, 100);
    }
}

function bookAppointment() {
    // Your existing booking logic
    alert('Booking confirmed!');
}