
/* =====================================
   LOGIN AUTHENTICATION SYSTEM
   Main JavaScript
===================================== */

const USERS_KEY = "secureAuthUsers";
const SESSION_KEY = "secureAuthSession";

// Get stored users
function getUsers() {
    try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

// Save users
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Display messages
function showMessage(element, message, type) {
    if (!element) return;

    element.textContent = message;
    element.className = "message " + type;
}

// Get current session
function getSession() {
    try {
        return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    } catch {
        return null;
    }
}

// Navigate to another page
function goToPage(page) {
    window.location.href = page;
}

// Protect dashboard page
function protectDashboard() {
    const session = getSession();

    if (!session || !session.email) {
        goToPage("index.html");
        return false;
    }

    const user = getUsers().find(
        item => item.email === session.email
    );

    if (!user) {
        sessionStorage.removeItem(SESSION_KEY);
        goToPage("index.html");
        return false;
    }

    const nameElement = document.getElementById("userName");
    const dashboardName = document.getElementById("dashboardName");
    const dashboardEmail = document.getElementById("dashboardEmail");

    if (nameElement) {
        nameElement.textContent = user.name;
    }

    if (dashboardName) {
        dashboardName.textContent = user.name;
    }

    if (dashboardEmail) {
        dashboardEmail.textContent = user.email;
    }

    return true;
}

// Registration
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("registerName")
            .value.trim();

        const email = document.getElementById("registerEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("registerPassword")
            .value;

        const confirmPassword = document.getElementById("confirmPassword")
            .value;

        const message = document.getElementById("registerMessage");

        if (name.length < 2) {
            showMessage(
                message,
                "Please enter a valid name.",
                "error"
            );
            return;
        }

        if (!email || !email.includes("@")) {
            showMessage(
                message,
                "Please enter a valid email address.",
                "error"
            );
            return;
        }

        if (password.length < 8) {
            showMessage(
                message,
                "Password must contain at least 8 characters.",
                "error"
            );
            return;
        }

        if (password !== confirmPassword) {
            showMessage(
                message,
                "Passwords do not match.",
                "error"
            );
            return;
        }

        const users = getUsers();

        const existingUser = users.some(
            user => user.email === email
        );

        if (existingUser) {
            showMessage(
                message,
                "This email is already registered. Please sign in.",
                "error"
            );
            return;
        }

        /*
          Demo only:
          Passwords are stored as plain text in localStorage.
          Do not use this approach for real accounts.
        */

        users.push({
            name: name,
            email: email,
            password: password
        });

        saveUsers(users);

        showMessage(
            message,
            "Registration successful! Redirecting to login...",
            "success"
        );

        registerForm.reset();

        setTimeout(() => {
            goToPage("index.html");
        }, 1200);
    });
}

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    // If already logged in, go to dashboard
    if (getSession()) {
        goToPage("dashboard.html");
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("loginPassword")
            .value;

        const message = document.getElementById("loginMessage");

        const users = getUsers();

        const user = users.find(
            item =>
                item.email === email &&
                item.password === password
        );

        if (!user) {
            showMessage(
                message,
                "Invalid email or password. Please try again.",
                "error"
            );
            return;
        }

        sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify({ email: user.email })
        );

        showMessage(
            message,
            "Login successful! Opening your dashboard...",
            "success"
        );

        setTimeout(() => {
            goToPage("dashboard.html");
        }, 700);
    });
}

// Dashboard access check
if (window.location.pathname.endsWith("/dashboard.html") ||
    window.location.pathname.endsWith("dashboard.html")) {
    protectDashboard();
}

// Logout
function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    goToPage("index.html");
}

const logoutLink = document.getElementById("logoutLink");
const dashboardLogout = document.getElementById("dashboardLogout");

if (logoutLink) {
    logoutLink.addEventListener("click", function (event) {
        event.preventDefault();
        logout();
    });
}

if (dashboardLogout) {
    dashboardLogout.addEventListener("click", logout);
}
