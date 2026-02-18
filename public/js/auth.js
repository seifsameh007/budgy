const authModal = document.getElementById('authModal');
const authContent = document.getElementById('authContent');

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
            <input type="password" name="password" placeholder="Password" required class="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <input type="password" name="confirmPassword" placeholder="Confirm Password" required class="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            
            <button type="button" class="w-full py-3 rounded-xl bg-white border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <img src="https://www.google.com/favicon.ico" class="w-4 h-4"> Sign up with Google
            </button>
            
            <button type="submit" class="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg">Sign Up</button>
        </form>
        <p class="mt-4 text-center text-sm text-gray-500">Already have an account? <button onclick="renderSignIn()" class="text-indigo-600 font-bold hover:underline">Sign In</button></p>
    `;
}

function renderSignIn() {
    authContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        <form onsubmit="handleLogin(event)" class="space-y-4">
            <input type="email" name="email" placeholder="Email Address" required class="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <input type="password" name="password" placeholder="Password" required class="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            
            <button type="button" class="w-full py-3 rounded-xl bg-white border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <img src="https://www.google.com/favicon.ico" class="w-4 h-4"> Sign in with Google
            </button>

            <button type="submit" class="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg">Sign In</button>
        </form>
        <p class="mt-4 text-center text-sm text-gray-500">Don't have an account? <button onclick="renderSignUp()" class="text-indigo-600 font-bold hover:underline">Sign Up</button></p>
    `;
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok) {
            alert('Registration successful! Please log in.');
            renderSignIn();
        } else {
            alert(result.message || 'Registration failed');
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred');
    }
}

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
            alert(result.message || 'Login failed');
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred');
    }
}
