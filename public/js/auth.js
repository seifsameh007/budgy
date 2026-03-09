const authModal = document.getElementById('authModal');
const authContent = document.getElementById('authContent');

// ─── Custom Popup Toast ───────────────────────────────────
function showToast(message, type = 'error') {
    // Remove existing toast
    const existing = document.getElementById('customToast');
    if (existing) existing.remove();

    const colors = {
        error: { bg: 'rgba(239, 68, 68, 0.95)', icon: '✕' },
        success: { bg: 'rgba(34, 197, 94, 0.95)', icon: '✓' },
        warning: { bg: 'rgba(234, 179, 8, 0.95)', icon: '⚠' }
    };

    const c = colors[type] || colors.error;

    const toast = document.createElement('div');
    toast.id = 'customToast';
    toast.innerHTML = `
        <div style="
            position: fixed; top: 30px; left: 50%; transform: translateX(-50%) translateY(-20px);
            z-index: 99999; display: flex; align-items: center; gap: 12px;
            padding: 16px 28px; border-radius: 16px;
            background: ${c.bg}; backdrop-filter: blur(20px);
            color: white; font-family: 'Alexandria', sans-serif; font-size: 0.95rem; font-weight: 600;
            box-shadow: 0 8px 32px rgba(0,0,0,0.25);
            opacity: 0; animation: toastSlideIn 0.4s ease forwards;
            max-width: 90vw;
        ">
            <span style="font-size: 1.2rem; min-width: 24px; text-align: center;">${c.icon}</span>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    // Auto remove after 3.5s
    setTimeout(() => {
        const el = toast.querySelector('div');
        if (el) el.style.animation = 'toastSlideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Inject toast animations
if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
        @keyframes toastSlideIn {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.95); }
            to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes toastSlideOut {
            from { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
            to { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.95); }
        }
    `;
    document.head.appendChild(style);
}

// ─── Auth Modal ───────────────────────────────────────────
function showAuth(type) {
    authModal.classList.remove('hidden');
    if (type === 'signup') {
        renderSignUp();
    } else {
        renderSignIn();
    }
}

function closeAuth() {
    authModal.classList.add('hidden');
}

// ─── Toggle Password Visibility ──────────────────────────
function togglePassword(inputId, btnId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    } else {
        input.type = 'password';
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    }
}

function passwordFieldHTML(name, placeholder, inputId, btnId) {
    return `
        <div class="relative">
            <input type="password" name="${name}" id="${inputId}" placeholder="${placeholder}" required
                class="w-full p-3 pr-12 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <button type="button" id="${btnId}" onclick="togglePassword('${inputId}', '${btnId}')"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
            </button>
        </div>
    `;
}

// ─── Sign Up Form ─────────────────────────────────────────
function renderSignUp() {
    authContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onsubmit="handleRegister(event)" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <input type="text" name="firstName" placeholder="First Name" required class="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <input type="text" name="secondName" placeholder="Last Name" required class="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <input type="tel" name="phone" placeholder="Phone Number" required class="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <input type="email" name="email" placeholder="Email Address" required class="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            ${passwordFieldHTML('password', 'Password', 'signupPass', 'toggleSignupPass')}
            ${passwordFieldHTML('confirmPassword', 'Confirm Password', 'signupConfirmPass', 'toggleSignupConfirmPass')}
            
            <button type="button" onclick="window.location.href='/auth/google'" class="w-full py-3 rounded-xl bg-white border border-gray-300 flex items-center justify-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition font-medium text-gray-700 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Sign up with Google
            </button>
            
            <button type="submit" class="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg">Sign Up</button>
        </form>
        <p class="mt-4 text-center text-sm text-gray-500">Already have an account? <button onclick="renderSignIn()" class="text-indigo-600 font-bold hover:underline">Sign In</button></p>
    `;
}

// ─── Sign In Form ─────────────────────────────────────────
function renderSignIn() {
    authContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        <form onsubmit="handleLogin(event)" class="space-y-4">
            <input type="email" name="email" placeholder="Email Address" required class="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            ${passwordFieldHTML('password', 'Password', 'loginPass', 'toggleLoginPass')}
            
            <button type="button" onclick="window.location.href='/auth/google'" class="w-full py-3 rounded-xl bg-white border border-gray-300 flex items-center justify-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition font-medium text-gray-700 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Sign in with Google
            </button>

            <button type="submit" class="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg">Sign In</button>
        </form>
        <p class="mt-4 text-center text-sm text-gray-500">Don't have an account? <button onclick="renderSignUp()" class="text-indigo-600 font-bold hover:underline">Sign Up</button></p>
    `;
}

// ─── Handle Register ──────────────────────────────────────
async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
        showToast('Passwords do not match!', 'warning');
        return;
    }

    if (data.password.length < 6) {
        showToast('Password must be at least 6 characters', 'warning');
        return;
    }

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: data.firstName,
                secondName: data.secondName,
                phone: data.phone,
                email: data.email,
                password: data.password
            })
        });
        const result = await res.json();
        if (res.ok) {
            showToast('Registration successful! Please log in.', 'success');
            setTimeout(() => renderSignIn(), 1000);
        } else {
            showToast(result.message || 'Registration failed', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Connection error, please try again', 'error');
    }
}

// ─── Handle Login ─────────────────────────────────────────
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok) {
            localStorage.setItem('user', JSON.stringify(result.user));
            window.location.href = '/dashboard.html';
        } else {
            showToast(result.message || 'Login failed', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Connection error, please try again', 'error');
    }
}
