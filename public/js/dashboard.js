const contentArea = document.getElementById('contentArea');
const pageTitle = document.getElementById('pageTitle');
const sidebarItems = document.querySelectorAll('.sidebar-item');

// Check Auth
const userJson = localStorage.getItem('user');
if (!userJson) {
    window.location.href = '/';
}
const user = JSON.parse(userJson);

// Global Data State
let userData = {};
let currentLang = localStorage.getItem('lang') || 'en';

// Translations
const translations = {
    en: {
        account: "Admin Account",
        goals: "Goals",
        tasks: "Tasks",
        events: "Events",
        obstacles: "Obstacles",
        finance: "Finance",
        settings: "Settings",
        logout: "Sign Out",
        welcome: "Welcome Back",
        countdown: "Countdown",
        // Inner Content
        manageAccount: "Manage Account",
        firstName: "First Name",
        lastName: "Last Name",
        phone: "Phone",
        newPassword: "New Password (Optional)",
        leaveBlank: "Leave blank to keep current",
        saveChanges: "Save Changes",
        fileSizeError: "File size too big (Max 4MB)",
        accountUpdated: "Account details updated (Simulation)",
        targets: "Targets",
        addGoal: "+ Add Goal",
        goalAchieved: "🎉 Did you really achieve this goal?",
        keepGoing: "Don't worry, it's just a matter of time! You got this. 💪",
        todo: "To-Do",
        newTask: "+ New Task",
        timeline: "Timeline",
        addEvent: "+ Add Event",
        upcoming: "Upcoming",
        ongoing: "Ongoing",
        ended: "Ended",
        duration: "Duration",
        days: "Days",
        hurtsStops: "Hurts & Stops",
        addObstacle: "+ Add Obstacle",
        started: "Started",
        debts: "Debts",
        assets: "Assets",
        liquidity: "Liquidity",
        spending: "Spending",
        details: "Details",
        add: "Add",
        debtDetails: "Debts Details",
        assetDetails: "Assets Details",
        savingsInput: "Savings (Liquidity In)",
        spendingOverview: "Spending Overview",
        smartCalendar: "Smart Calendar",
        sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat",
        dateDetails: "Date Details",
        noTransactions: "No transactions yet.",
        selectType: "Select Type",
        itemName: "Item Name",
        amount: "Amount (EGP)",
        description: "Description (Optional)",
        addTransaction: "Add Transaction",
        // Prompts
        enterEventName: "Event Name:",
        enterStartDate: "Start Date (YYYY-MM-DD):",
        enterEndDate: "End Date (YYYY-MM-DD):",
        enterObstacleName: "Obstacle Name (e.g., Illness, Depression):",
        enterDescription: "Description:",
        enterGoalName: "Goal Name:",
        enterTaskName: "Task Name:",
        deleteConfirm: "Are you sure you want to delete this item?",
        confirm: "Confirm",
        cancel: "Cancel",
        buySell: "Buy & Sell",
        buysell: "Buy & Sell",
        buyList: "Buy List",
        sellList: "Sell List",
        addBuyItem: "+ Add Item",
        addSellItem: "+ Add Item",
        enterItemName: "Item Name:",
        enterPrice: "Price (EGP):",
        noBuyItems: "No buy items yet.",
        noSellItems: "No sell items yet.",
        totalBuy: "Total Buy",
        totalSell: "Total Sell"
    },
    ar: {
        account: "ادارة الحساب",
        goals: "الاهداف",
        tasks: "المهام",
        events: "الاحداث",
        obstacles: "العقبات",
        finance: "الماليه",
        settings: "الاعدادات",
        logout: "تسجيل خروج",
        welcome: "مرحباً بك",
        countdown: "العد التنازلي",
        // Inner Content
        manageAccount: "ادارة الحساب",
        firstName: "الاسم الاول",
        lastName: "الاسم الثاني",
        phone: "رقم الهاتف",
        newPassword: "كلمة مرور جديدة (اختياري)",
        leaveBlank: "اتركه فارغاً للاحتفاظ بالحالية",
        saveChanges: "حفظ التغييرات",
        fileSizeError: "حجم الملف كبير جداً (اقصى حد 4 ميجا)",
        accountUpdated: "تم تحديث بيانات الحساب (محاكاة)",
        targets: "الاهداف الحالية",
        addGoal: "+ اضافة هدف",
        goalAchieved: "🎉 هل حققت هذا الهدف حقاً؟",
        keepGoing: "لا تقلق، انها مسألة وقت فقط! انت تستطيع. 💪",
        todo: "قائمة المهام",
        newTask: "+ مهمة جديدة",
        timeline: "الجدول الزمني",
        addEvent: "+ اضافة حدث",
        upcoming: "قادم",
        ongoing: "جاري",
        ended: "انتهى",
        duration: "المدة",
        days: "ايام",
        hurtsStops: "عقبات و توقفات",
        addObstacle: "+ اضافة عقبة",
        started: "بدأ",
        debts: "الديون",
        assets: "الاصول",
        liquidity: "السيولة",
        spending: "الصرف",
        details: "تفاصيل",
        add: "اضافة",
        debtDetails: "تفاصيل الديون",
        assetDetails: "تفاصيل الاصول",
        savingsInput: "المدخرات (اضافة سيولة)",
        spendingOverview: "نظرة عامة علي الصرف",
        smartCalendar: "التقويم الذكي",
        sun: "احد", mon: "اثنين", tue: "ثلاثاء", wed: "اربعاء", thu: "خميس", fri: "جمعة", sat: "سبت",
        dateDetails: "تفاصيل التاريخ",
        noTransactions: "لا يوجد معاملات بعد.",
        selectType: "اختر النوع",
        itemName: "اسم العنصر",
        amount: "القيمة (جنيه)",
        description: "الوصف (اختياري)",
        addTransaction: "اضافة معاملة",
        // Prompts
        enterEventName: "اسم الحدث:",
        enterStartDate: "تاريخ البدء (YYYY-MM-DD):",
        enterEndDate: "تاريخ الانتهاء (YYYY-MM-DD):",
        enterObstacleName: "اسم العقبة (مثال: مرض، اكتئاب):",
        enterDescription: "الوصف:",
        enterGoalName: "اسم الهدف:",
        enterTaskName: "اسم المهمة:",
        deleteConfirm: "هل انت متأكد انك تريد حذف هذا العنصر؟",
        confirm: "تأكيد",
        cancel: "الغاء",
        buySell: "شراء و بيع",
        buysell: "شراء و بيع",
        buyList: "قائمة الشراء",
        sellList: "قائمة البيع",
        addBuyItem: "+ اضافة عنصر",
        addSellItem: "+ اضافة عنصر",
        enterItemName: "اسم العنصر:",
        enterPrice: "السعر (جنيه):",
        noBuyItems: "لا يوجد عناصر شراء بعد.",
        noSellItems: "لا يوجد عناصر بيع بعد.",
        totalBuy: "اجمالي الشراء",
        totalSell: "اجمالي البيع"
    }
};

// Apply Theme & Lang on load
const html = document.documentElement;
if (localStorage.getItem('theme') === 'dark') html.classList.add('dark');

if (currentLang === 'ar') {
    html.dir = 'rtl';
    html.lang = 'ar';
} else {
    html.dir = 'ltr';
    html.lang = 'en';
}

function toggleTheme() {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    // Update button icon if present
    const btn = document.getElementById('themeToggleSidebar');
    if (btn) btn.innerHTML = html.classList.contains('dark') ? '<span><i class="fa-solid fa-sun"></i></span> Light Mode' : '<span><i class="fa-solid fa-moon"></i></span> Dark Mode';
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('lang', currentLang);
    location.reload(); // Simple reload to apply changes cleanly
}

// Initial Load
(async () => {
    await loadUserData();
    const savedSection = localStorage.getItem('activeSection') || 'account';
    loadSection(savedSection);
    updateSidebarText();
})();

function updateSidebarText() {
    const t = translations[currentLang];

    // Sidebar
    const navIds = ['account', 'goals', 'tasks', 'events', 'obstacles', 'finance', 'buysell'];
    navIds.forEach(id => {
        const el = document.getElementById('nav-' + id);
        if (el) {
            // Keep icon, replace text
            const icon = el.querySelector('span').outerHTML;
            el.innerHTML = `${icon} ${t[id]}`;
        }
    });

    // Theme Toggle
    const themeBtn = document.getElementById('themeToggleSidebar');
    if (themeBtn) {
        const isDark = html.classList.contains('dark');
        themeBtn.innerHTML = isDark
            ? `<span><i class="fa-solid fa-sun"></i></span> ${currentLang === 'ar' ? 'الوضع النهاري' : 'Light Mode'}`
            : `<span><i class="fa-solid fa-moon"></i></span> ${currentLang === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}`;
    }

    // Logout
    const logoutBtn = document.querySelector('button[onclick="logout()"]');
    if (logoutBtn) {
        logoutBtn.innerHTML = `<span><i class="fa-solid fa-right-from-bracket"></i></span> ${t.logout}`;
    }
}

async function loadUserData() {
    console.log('[loadUserData] Loading data for user:', user);
    if (!user || !user.id) {
        console.error('[loadUserData] ERROR: No user.id found! User object:', user);
        return;
    }
    try {
        const res = await fetch(`/api/data?userId=${user.id}`);
        if (!res.ok) {
            console.error('[loadUserData] Server error:', res.status);
            return;
        }
        userData = await res.json();
        console.log('[loadUserData] Loaded userData:', JSON.stringify(userData).substring(0, 200));
    } catch (err) {
        console.error('[loadUserData] Failed to load data:', err);
    }
}

async function saveData(type, data) {
    console.log('[saveData] Saving:', type, 'user.id:', user?.id, 'data length:', Array.isArray(data) ? data.length : 'object');
    if (!user || !user.id) {
        console.error('[saveData] ERROR: Cannot save - no user.id! User:', user);
        return;
    }

    try {
        const payload = { userId: user.id, type, data };
        console.log('[saveData] POST payload:', JSON.stringify(payload).substring(0, 300));
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log('[saveData] Server response:', response.status, result);

        if (!response.ok) {
            throw new Error(result.message || 'Server error');
        }

        userData[type] = data;
        console.log('[saveData] SUCCESS - data saved to server and local state');
    } catch (err) {
        console.error('[saveData] FAILED:', err);
    }
}

// loadSection is defined below (after renderFinance) to ensure all render functions are available

function renderSettings() {
    pageTitle.innerText = 'Settings';
    contentArea.innerHTML = `
        <div class="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-lg max-w-2xl mx-auto text-center">
            <h2 class="text-2xl font-bold mb-4">Settings</h2>
            <p class="text-gray-600 mb-6">Global application settings.</p>
            <div class="space-y-4">
                <div class="flex justify-between items-center p-4 bg-white/60 rounded-xl">
                    <span>Dark Mode</span>
                    <button class="bg-gray-200 px-4 py-2 rounded-full text-sm">Toggle</button> 
                </div>
                 <div class="flex justify-between items-center p-4 bg-white/60 rounded-xl">
                    <span>Language</span>
                    <select class="bg-transparent border-none outline-none"><option>English</option><option>Arabic</option></select>
                </div>
            </div>
        </div>
    `;
}

// Global Calendar State
let currentCalendarDate = new Date('2026-02-01T00:00:00');
const MAX_DATE = new Date('2026-12-01T00:00:00');
const MIN_DATE = new Date('2026-02-01T00:00:00');

// --- End of Finance & Calendar Merged Section ---

// Re-implement handleAddTransaction for the new modal if it wasn't included in renderFinance block
// It seems I didn't include handleAddTransaction in the renderFinance block in step 143.
// I only included renderCalendarInside, changeMonth, createFinanceItemHTML, openFinanceModal.
// So handleAddTransaction is still needed!
// However, openDayModal logic needs to be checked.
// The OLD openDayModal (Step 107) calls `renderCalendar()` at the end of handleAddTransaction (which is called by the form).
// `handleAddTransaction` calls `renderCalendar()`. This is BAD. It should call `renderFinance()`.

async function handleAddTransaction(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const newItem = {
        id: Date.now().toString(),
        name: data.name,
        amount: data.amount,
        description: data.description,
        type: data.type,
        date: data.date,
        source: 'Event'
    };

    // 1. Add to Calendar Transactions
    let calendarTrans = userData.calendarTransactions || [];
    calendarTrans.push(newItem);
    await saveData('calendarTransactions', calendarTrans);

    // 2. Add to specific Finance Module section
    let list = userData[data.type] || [];
    const financeItem = {
        id: newItem.id,
        name: newItem.name,
        amount: newItem.amount,
        date: newItem.date,
        source: 'Event'
    };
    list.push(financeItem);
    await saveData(data.type, list);

    // Refresh
    openDayModal(data.date);
    renderFinance(); // UPDATED to renderFinance
}

function openDayModal(dateStr) {
    const modal = document.getElementById('dayModal');
    const title = document.getElementById('modalDateTitle');
    const dateInput = document.getElementById('modalDateInput');
    const list = document.getElementById('dayTransactionsList');

    // Create modal if it doesn't exist (it should exist from renderCalendarInside HTML injection? No, I put it in the HTML string there)
    // Wait, renderCalendarInside injects innerHTML into a container. 
    // The modal HTML was part of the old renderCalendar's full innerHTML replacement of contentArea.
    // In renderFinance, I removed the modal HTML!
    // I need to add the modal HTML back to the DOM, or inside renderFinance.
    // Let's add it to renderCalendarInside or check if it's there.

    if (!modal) {
        console.error("Day Modal not found!");
        return;
    }

    modal.classList.remove('hidden');
    title.innerText = dateStr;
    dateInput.value = dateStr;

    const transactions = userData.calendarTransactions || [];
    const daysTrans = transactions.filter(t => t.date === dateStr);

    list.innerHTML = daysTrans.map(t => `
        <div class="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded transition-colors">
            <span class="font-bold ${t.type === 'debts' ? 'text-red-500 dark:text-red-400' : t.type === 'assets' ? 'text-blue-500 dark:text-blue-400' : t.type === 'savings' ? 'text-green-500 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}">${t.amount}</span>
            <span class="text-gray-800 dark:text-gray-200">${t.name}</span>
        </div>
    `).join('') || '<p class="text-gray-400 text-center">No transactions yet.</p>';
}


// --- Account Section ---
function renderAccount() {
    const t = translations[currentLang];
    pageTitle.innerText = t.manageAccount;
    contentArea.innerHTML = `
        <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-lg max-w-2xl mx-auto dark:border dark:border-white/10 frost-card">
            <div class="flex items-center gap-6 mb-8">
                <div class="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-4xl text-indigo-500 dark:text-indigo-300 overflow-hidden relative">
                    <img id="profilePreview" src="${userData.profileImage || ''}" class="${userData.profileImage ? 'absolute inset-0 w-full h-full object-cover' : 'hidden'}">
                    <span class="${userData.profileImage ? 'hidden' : ''}">👤</span>
                    <input type="file" onchange="handleImageUpload(this)" class="absolute inset-0 opacity-0 cursor-pointer">
                </div>
                <div>
                    <h2 class="text-2xl font-bold dark:text-white">${user.firstName} ${user.secondName}</h2>
                    <p class="text-gray-500 dark:text-gray-400">${user.email}</p>
                </div>
            </div>

            <form onsubmit="handleAccountUpdate(event)" class="space-y-4">
                 <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1 dark:text-gray-300">${t.firstName}</label>
                        <input type="text" name="firstName" value="${user.firstName}" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1 dark:text-gray-300">${t.lastName}</label>
                        <input type="text" name="secondName" value="${user.secondName}" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1 dark:text-gray-300">${t.phone}</label>
                     <input type="text" name="phone" value="${user.phone}" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                </div>
                <div>
                     <label class="block text-sm font-medium mb-1 dark:text-gray-300">${t.newPassword}</label>
                     <input type="password" name="password" placeholder="${t.leaveBlank}" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500">
                </div>

                <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md">${t.saveChanges}</button>
            </form>
        </div>
    `;
}

function handleImageUpload(input) {
    const t = translations[currentLang];
    if (input.files && input.files[0]) {
        if (input.files[0].size > 50 * 1024 * 1024) { // Updated to 50MB per server
            showModal({
                title: t.account,
                body: `<p class="text-red-500">${t.fileSizeError}</p>`,
                confirmText: 'OK',
                cancelText: false
            });
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profilePreview').src = e.target.result;
            document.getElementById('profilePreview').classList.remove('hidden');
            saveData('profileImage', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

async function handleAccountUpdate(e) {
    e.preventDefault();
    const t = translations[currentLang];
    showModal({
        title: t.manageAccount,
        body: `<p class="text-center text-green-600 dark:text-green-400 font-medium">${t.accountUpdated}</p>`,
        confirmText: 'OK',
        cancelText: false
    });
}

// --- Goals Section ---
function renderGoals() {
    const t = translations[currentLang];
    pageTitle.innerText = t.goals;
    const goals = userData.goals || [];

    contentArea.innerHTML = `
        <div class="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50 dark:border-white/10 frost-card">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-indigo-900 dark:text-indigo-300">${t.targets}</h2>
                <button onclick="openAddItemModal('goal')" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md">${t.addGoal}</button>
            </div>
            
            <div class="space-y-3" id="goalsList">
                ${goals.map(goal => createGoalItemHTML(goal)).join('')}
            </div>
        </div>
    `;
}

function createGoalItemHTML(goal) {
    return `
        <div class="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/60 rounded-xl hover:bg-white/80 dark:hover:bg-gray-600/80 transition group border border-white/40 dark:border-white/10 shadow-sm frost-item">
            <div class="flex items-center gap-4">
                <button onclick="toggleGoal('${goal.id}')" class="w-6 h-6 rounded-full border-2 border-indigo-500 flex items-center justify-center transition ${goal.completed ? 'bg-indigo-500' : 'hover:bg-indigo-100 dark:hover:bg-indigo-900'}">
                    ${goal.completed ? '<i class="fas fa-check text-white text-xs"></i>' : ''}
                </button>
                <span class="${goal.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'font-medium dark:text-gray-200'}">${goal.title}</span>
            </div>
            <div class="flex gap-2">
                <button onclick="openEditItemModal('goals', '${goal.id}')" class="text-blue-400 hover:text-blue-600 transition"><i class="fas fa-pen"></i></button>
                <button onclick="deleteItem('goals', '${goal.id}')" class="text-red-400 hover:text-red-600 transition"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
}

async function toggleGoal(id) {
    const t = translations[currentLang];
    const goals = userData.goals || [];
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    if (!goal.completed) {
        showModal({
            title: t.goals,
            body: `<p>${t.goalAchieved}</p>`,
            confirmText: currentLang === 'ar' ? 'نعم، حققته!' : 'Yes, Achieved!',
            cancelText: t.cancel,
            onConfirm: async () => {
                goal.completed = true;
                await saveData('goals', goals);
                triggerConfetti();
                renderGoals();
            }
        });
    } else {
        goal.completed = false;
        await saveData('goals', goals);
        renderGoals();
    }
}

// --- Tasks Section ---
function renderTasks() {
    const t = translations[currentLang];
    pageTitle.innerText = t.tasks;
    const tasks = userData.tasks || [];

    contentArea.innerHTML = `
        <div class="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50 dark:border-white/10 frost-card">
             <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">${t.todo}</h2>
                <button onclick="openAddItemModal('task')" class="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow-md">${t.newTask}</button>
            </div>
            
            <div class="space-y-2" id="tasksList">
                 ${tasks.map(task => createTaskItemHTML(task)).join('')}
            </div>
        </div>
    `;
}

function createTaskItemHTML(task) {
    return `
        <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition group frost-item">
            <div class="flex items-center gap-3">
                 <input type="checkbox" onchange="toggleTask('${task.id}')" ${task.completed ? 'checked' : ''} class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:bg-gray-600 dark:border-gray-500">
                <span class="${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}">${task.title}</span>
            </div>
             <div class="flex gap-2">
                <button onclick="openEditItemModal('tasks', '${task.id}')" class="text-blue-400 hover:text-blue-600 transition"><i class="fas fa-pen"></i></button>
                <button onclick="deleteItem('tasks', '${task.id}')" class="text-gray-400 hover:text-red-500 transition"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
}

async function toggleTask(id) {
    const tasks = userData.tasks || [];
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        await saveData('tasks', tasks);
        renderTasks();
    }
}

// --- Events Section ---
function renderEvents() {
    const t = translations[currentLang];
    pageTitle.innerText = t.events;
    const events = userData.events || [];

    contentArea.innerHTML = `
        <div class="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50 dark:border-white/10 frost-card">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-pink-700 dark:text-pink-400">${t.timeline}</h2>
                <button onclick="openAddEventModal()" class="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition shadow-md">${t.addEvent}</button>
            </div>
            
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3" id="eventsList">
                ${events.map(event => createEventItemHTML(event)).join('')}
            </div>
        </div>
    `;
}

function createEventItemHTML(event) {
    const t = translations[currentLang];
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    let status = t.upcoming;
    let statusColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    let cardStyle = '';

    if (now > end) {
        status = t.ended;
        statusColor = 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
        cardStyle = 'opacity-60 relative overflow-hidden';
    } else if (now >= start && now <= end) {
        status = t.ongoing;
        statusColor = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        cardStyle = 'border-l-4 border-green-500';
    }

    const titleClass = status === t.ended ? 'line-through decoration-2 decoration-gray-400 dark:decoration-gray-500' : 'font-bold';

    // Global helper for consistent date formatting
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB');
    };

    return `
        <div class="bg-white/70 dark:bg-gray-700/70 p-5 rounded-xl shadow-sm hover:shadow-md transition relative group ${cardStyle} frost-item">
            ${status === t.ended ? '<div class="absolute inset-x-0 top-1/2 h-1 bg-gray-400 dark:bg-gray-500 rotate-12 opacity-50 pointer-events-none"></div>' : ''}
            
            <div class="flex justify-between items-start mb-2">
                <span class="px-2 py-1 rounded text-xs font-bold uppercase ${statusColor}">${status}</span>
                <div class="flex gap-2">
                    <button onclick="openEditItemModal('events', '${event.id}')" class="text-blue-300 hover:text-blue-500 transition"><i class="fas fa-pen"></i></button>
                    <button onclick="deleteItem('events', '${event.id}')" class="text-red-300 hover:text-red-500 transition"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            
            <h3 class="text-lg text-gray-800 dark:text-white mb-1 ${titleClass}">${event.title}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">${formatDate(event.startDate)} - ${formatDate(event.endDate)}</p>
            
            <div class="text-xs text-gray-400 dark:text-gray-500">
                ${t.duration}: ${Math.ceil((end - start) / (1000 * 60 * 60 * 24))} ${t.days}
            </div>
        </div>
    `;
}
// --- Custom Date Picker ---
function initDatePicker(containerId, weekdays) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const displayInput = container.querySelector('input[type="text"]');
    const hiddenInput = container.querySelector('input[type="hidden"]');
    let currentMonth = new Date();
    let dropdown = null;

    displayInput.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close any other open date pickers
        document.querySelectorAll('.date-picker-dropdown').forEach(d => d.remove());

        dropdown = document.createElement('div');
        dropdown.className = 'date-picker-dropdown';
        renderDatePickerCalendar(dropdown, currentMonth, weekdays, hiddenInput.value, (selectedDate) => {
            const d = selectedDate;
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            displayInput.value = `${dd}/${mm}/${yyyy}`;
            hiddenInput.value = `${yyyy}-${mm}-${dd}`;
            dropdown.remove();
            dropdown = null;
        }, (newMonth) => {
            currentMonth = newMonth;
            renderDatePickerCalendar(dropdown, currentMonth, weekdays, hiddenInput.value, arguments[3], arguments[4]);
        });
        container.appendChild(dropdown);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (dropdown && !container.contains(e.target)) {
            dropdown.remove();
            dropdown = null;
        }
    });
}

function renderDatePickerCalendar(container, viewDate, weekdays, selectedValue, onSelect, onNavigate) {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const months = currentLang === 'ar'
        ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let html = `
        <div class="date-picker-header">
            <button type="button" data-nav="prev">‹</button>
            <span>${months[month]} ${year}</span>
            <button type="button" data-nav="next">›</button>
        </div>
        <div class="date-picker-weekdays">
            ${weekdays.map(d => `<span>${d}</span>`).join('')}
        </div>
        <div class="date-picker-days">
    `;

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        html += `<button type="button" class="other-month" data-date="${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}" disabled>${day}</button>`;
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dateObj = new Date(year, month, d);
        dateObj.setHours(0, 0, 0, 0);
        const isToday = dateObj.getTime() === today.getTime();
        const isSelected = dateStr === selectedValue;
        let cls = '';
        if (isToday) cls += ' today';
        if (isSelected) cls += ' selected';
        html += `<button type="button" class="${cls}" data-date="${dateStr}">${d}</button>`;
    }

    // Next month days to fill grid
    const totalCells = firstDay + daysInMonth;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let d = 1; d <= remaining; d++) {
        html += `<button type="button" class="other-month" disabled>${d}</button>`;
    }

    html += '</div>';
    container.innerHTML = html;

    // Navigation
    container.querySelector('[data-nav="prev"]').addEventListener('click', (e) => {
        e.stopPropagation();
        const newDate = new Date(year, month - 1, 1);
        renderDatePickerCalendar(container, newDate, weekdays, selectedValue, onSelect, onNavigate);
    });
    container.querySelector('[data-nav="next"]').addEventListener('click', (e) => {
        e.stopPropagation();
        const newDate = new Date(year, month + 1, 1);
        renderDatePickerCalendar(container, newDate, weekdays, selectedValue, onSelect, onNavigate);
    });

    // Day click
    container.querySelectorAll('.date-picker-days button:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parts = btn.dataset.date.split('-');
            const selected = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            onSelect(selected);
        });
    });
}

function openAddEventModal() {
    const t = translations[currentLang];
    const weekdays = currentLang === 'ar'
        ? ['أحد', 'أثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت']
        : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const inputs = `
        <form id="modalForm" class="space-y-3">
            <div>
                 <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterEventName}</label>
                 <input type="text" name="title" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                     <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterStartDate}</label>
                     <div class="custom-date-input" id="startDatePicker">
                         <input type="text" name="startDate" required readonly placeholder="dd/mm/yyyy" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer">
                         <input type="hidden" name="startDateValue">
                     </div>
                </div>
                <div>
                     <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterEndDate}</label>
                     <div class="custom-date-input" id="endDatePicker">
                         <input type="text" name="endDate" required readonly placeholder="dd/mm/yyyy" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer">
                         <input type="hidden" name="endDateValue">
                     </div>
                </div>
            </div>
        </form>
    `;

    showModal({
        title: t.addEvent,
        body: inputs,
        confirmText: t.add,
        onConfirm: (data) => {
            if (!data) return;
            const startVal = document.querySelector('#startDatePicker input[name="startDateValue"]')?.value;
            const endVal = document.querySelector('#endDatePicker input[name="endDateValue"]')?.value;
            if (!startVal || !endVal) return;
            const newItem = {
                id: Date.now().toString(),
                title: data.title,
                startDate: startVal,
                endDate: endVal
            };
            let list = userData.events || [];
            list.push(newItem);
            saveData('events', list).then(() => renderEvents());
        }
    });

    // Init custom date pickers after modal renders
    setTimeout(() => {
        initDatePicker('startDatePicker', weekdays);
        initDatePicker('endDatePicker', weekdays);
    }, 50);
}

// --- Obstacles Section ---
function renderObstacles() {
    const t = translations[currentLang];
    pageTitle.innerText = t.obstacles;
    const obstacles = userData.obstacles || [];

    contentArea.innerHTML = `
        <div class="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50 dark:border-white/10 frost-card">
             <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-red-800 dark:text-red-400">${t.hurtsStops}</h2>
                <button onclick="openAddObstacleModal()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-md">${t.addObstacle}</button>
            </div>
            
            <div class="space-y-4" id="obstaclesList">
                 ${obstacles.map(obs => createObstacleItemHTML(obs)).join('')}
            </div>
        </div>
    `;
}

function createObstacleItemHTML(obs) {
    const t = translations[currentLang];
    // Helper for formatting
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB');
    };

    return `
        <div class="bg-red-50/50 dark:bg-red-900/20 p-5 rounded-xl border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/30 transition group relative frost-item">
             <div class="flex justify-between items-start">
                <div>
                     <h3 class="text-lg font-bold text-red-900 dark:text-red-300 mb-1">${obs.title}</h3>
                     <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">${obs.description}</p>
                     <div class="flex gap-4 text-xs text-red-400 dark:text-red-400 font-mono">
                        <span>${t.started}: ${formatDate(obs.startDate)}</span>
                        <span>${t.ended}: ${obs.endDate ? formatDate(obs.endDate) : t.ongoing}</span>
                     </div>
                </div>
                 <div class="flex gap-2">
                    <button onclick="openEditItemModal('obstacles', '${obs.id}')" class="text-blue-300 hover:text-blue-500 transition"><i class="fas fa-pen"></i></button>
                    <button onclick="deleteItem('obstacles', '${obs.id}')" class="text-red-300 hover:text-red-500 transition"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    `;
}

function openAddObstacleModal() {
    const t = translations[currentLang];
    const weekdays = currentLang === 'ar'
        ? ['أحد', 'أثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت']
        : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const todayISO = new Date().toISOString().split('T')[0];
    const todayParts = todayISO.split('-');
    const todayDisplay = `${todayParts[2]}/${todayParts[1]}/${todayParts[0]}`;

    const inputs = `
        <form id="modalForm" class="space-y-3">
            <div>
                 <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterObstacleName}</label>
                 <input type="text" name="title" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 outline-none">
            </div>
            <div>
                 <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterDescription}</label>
                 <textarea name="description" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows="2"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                     <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterStartDate}</label>
                     <div class="custom-date-input" id="obsStartDatePicker">
                         <input type="text" name="startDate" required readonly value="${todayDisplay}" placeholder="dd/mm/yyyy" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer">
                         <input type="hidden" name="startDateValue" value="${todayISO}">
                     </div>
                </div>
                <div>
                     <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterEndDate}</label>
                     <div class="custom-date-input" id="obsEndDatePicker">
                         <input type="text" name="endDate" readonly placeholder="dd/mm/yyyy" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer">
                         <input type="hidden" name="endDateValue">
                     </div>
                </div>
            </div>
        </form>
    `;

    showModal({
        title: t.addObstacle,
        body: inputs,
        confirmText: t.add,
        onConfirm: (data) => {
            if (!data) return;
            const startVal = document.querySelector('#obsStartDatePicker input[name="startDateValue"]')?.value;
            const endVal = document.querySelector('#obsEndDatePicker input[name="endDateValue"]')?.value;
            if (!startVal) return;
            const newItem = {
                id: Date.now().toString(),
                title: data.title,
                description: data.description,
                startDate: startVal,
                endDate: endVal || ''
            };
            let list = userData.obstacles || [];
            list.push(newItem);
            saveData('obstacles', list).then(() => renderObstacles());
        }
    });

    // Init custom date pickers after modal renders
    setTimeout(() => {
        initDatePicker('obsStartDatePicker', weekdays);
        initDatePicker('obsEndDatePicker', weekdays);
    }, 50);
}

// --- Finance Section ---
function renderFinance() {
    pageTitle.innerText = translations[currentLang].finance;
    const t = translations[currentLang];

    // Load finance data
    const debts = userData.debts || [];
    const assets = userData.assets || [];
    const spending = userData.spending || [];
    const savings = userData.savings || [];

    // Calculate totals
    const totalDebts = debts.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalAssets = assets.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalSpending = spending.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalSavings = savings.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const currentLiquidity = totalSavings - totalSpending;


    contentArea.innerHTML = `
        <!-- Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200/60 dark:border-red-800/40">
                <h3 class="text-red-600 dark:text-red-400 text-xs font-bold uppercase">${currentLang === 'ar' ? 'الديون' : 'Debts'}</h3>
                <p class="text-xl font-bold text-red-800 dark:text-red-200">${totalDebts.toLocaleString()} EGP</p>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-200/60 dark:border-blue-800/40">
                <h3 class="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">${currentLang === 'ar' ? 'الاصول' : 'Assets'}</h3>
                <p class="text-xl font-bold text-blue-800 dark:text-blue-200">${totalAssets.toLocaleString()} EGP</p>
            </div>
            <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-200/60 dark:border-green-800/40">
                <h3 class="text-green-600 dark:text-green-400 text-xs font-bold uppercase">${currentLang === 'ar' ? 'السيولة' : 'Liquidity'}</h3>
                <p class="text-xl font-bold text-green-800 dark:text-green-200">${currentLiquidity.toLocaleString()} EGP</p>
            </div>
            <div class="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-200/60 dark:border-orange-800/40">
                <h3 class="text-orange-600 dark:text-orange-400 text-xs font-bold uppercase">${currentLang === 'ar' ? 'الصرف' : 'Spending'}</h3>
                <p class="text-xl font-bold text-orange-800 dark:text-orange-200">${totalSpending.toLocaleString()} EGP</p>
            </div>
        </div>

        <!-- Details Grid -->
        <div class="grid md:grid-cols-2 gap-4 mb-6">
            <!-- Debts -->
            <div class="bg-white/50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200/50 dark:border-white/10">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-bold text-sm text-gray-700 dark:text-gray-200">${currentLang === 'ar' ? 'الديون' : 'Debts'}</h3>
                    <button onclick="openFinanceModal('debts')" class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 px-2 py-1 rounded-lg text-xs font-bold">+ ${currentLang === 'ar' ? 'اضافة' : 'Add'}</button>
                </div>
                <div class="space-y-1.5 max-h-40 overflow-y-auto">
                    ${debts.map(item => createFinanceItemHTML(item, 'text-red-600 dark:text-red-400', 'debts')).join('')}
                    ${debts.length === 0 ? '<p class="text-gray-400 text-xs text-center py-2">' + (currentLang === 'ar' ? 'لا يوجد بيانات' : 'No data') + '</p>' : ''}
                </div>
            </div>

            <!-- Assets -->
            <div class="bg-white/50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200/50 dark:border-white/10 frost-card">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-bold text-sm text-gray-700 dark:text-gray-200">${currentLang === 'ar' ? 'الاصول' : 'Assets'}</h3>
                    <button onclick="openFinanceModal('assets')" class="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-1 rounded-lg text-xs font-bold">+ ${currentLang === 'ar' ? 'اضافة' : 'Add'}</button>
                </div>
                <div class="space-y-1.5 max-h-40 overflow-y-auto">
                    ${assets.map(item => createFinanceItemHTML(item, 'text-blue-600 dark:text-blue-400', 'assets')).join('')}
                    ${assets.length === 0 ? '<p class="text-gray-400 text-xs text-center py-2">' + (currentLang === 'ar' ? 'لا يوجد بيانات' : 'No data') + '</p>' : ''}
                </div>
            </div>

            <!-- Savings -->
            <div class="bg-white/50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200/50 dark:border-white/10 frost-card">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-bold text-sm text-gray-700 dark:text-gray-200">${currentLang === 'ar' ? 'المدخرات' : 'Savings'}</h3>
                    <button onclick="openFinanceModal('savings')" class="text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 px-2 py-1 rounded-lg text-xs font-bold">+ ${currentLang === 'ar' ? 'اضافة' : 'Add'}</button>
                </div>
                <div class="space-y-1.5 max-h-40 overflow-y-auto">
                    ${savings.map(item => createFinanceItemHTML(item, 'text-green-600 dark:text-green-400', 'savings')).join('')}
                    ${savings.length === 0 ? '<p class="text-gray-400 text-xs text-center py-2">' + (currentLang === 'ar' ? 'لا يوجد بيانات' : 'No data') + '</p>' : ''}
                </div>
            </div>

            <!-- Spending -->
            <div class="bg-white/50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200/50 dark:border-white/10 frost-card">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-bold text-sm text-gray-700 dark:text-gray-200">${currentLang === 'ar' ? 'الصرف' : 'Spending'}</h3>
                    <button onclick="openFinanceModal('spending')" class="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30 px-2 py-1 rounded-lg text-xs font-bold">+ ${currentLang === 'ar' ? 'اضافة' : 'Add'}</button>
                </div>
                <div class="space-y-1.5 max-h-40 overflow-y-auto">
                    ${spending.map(item => createFinanceItemHTML(item, 'text-orange-600 dark:text-orange-400', 'spending')).join('')}
                    ${spending.length === 0 ? '<p class="text-gray-400 text-xs text-center py-2">' + (currentLang === 'ar' ? 'لا يوجد بيانات' : 'No data') + '</p>' : ''}
                </div>
            </div>
        </div>

        <!-- Smart Calendar -->
        <h3 class="text-lg font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            ${currentLang === 'ar' ? 'التقويم الذكي' : 'Smart Calendar'}
        </h3>
        <div id="calendarContainer"></div>
    `;

    // Render Calendar inside the container
    renderCalendarInside('calendarContainer');
}

function renderCalendarInside(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Calendar Generation Logic (Reused)
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    // Month Names
    const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthNamesAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const monthNames = currentLang === 'ar' ? monthNamesAr : monthNamesEn;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const transactions = userData.calendarTransactions || [];

    let daysHTML = '';
    for (let i = 0; i < firstDay; i++) {
        daysHTML += `<div class="p-4"></div>`;
    }

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayTrans = transactions.filter(t => t.date === dateStr);
        const isToday = dateStr === todayStr;

        let dotsHTML = '';
        dayTrans.forEach(t => {
            let color = 'bg-gray-400';
            if (t.type === 'debts') color = 'bg-red-500';
            if (t.type === 'assets') color = 'bg-blue-500';
            if (t.type === 'savings') color = 'bg-green-500';
            if (t.type === 'spending') color = 'bg-orange-500';
            dotsHTML += `<span class="w-2 h-2 rounded-full ${color} block"></span>`;
        });

        const todayClasses = isToday ? 'ring-2 ring-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'bg-white/40 dark:bg-gray-700/40';

        daysHTML += `
            <div onclick="openDayModal('${dateStr}')" class="${todayClasses} p-2 h-24 rounded-xl border border-white/50 dark:border-white/10 hover:bg-white/60 dark:hover:bg-gray-600/60 transition cursor-pointer flex flex-col items-center justify-between relative group">
                <span class="font-bold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}">${day}</span>
                <div class="flex gap-1 flex-wrap justify-center content-end w-full px-1">
                    ${dotsHTML}
                </div>
                ${dayTrans.length > 0 ? `<div class="absolute bottom-1 right-1 text-xs text-gray-400 dark:text-gray-500 font-mono">${dayTrans.length}</div>` : ''}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/40 dark:border-white/10">
            <!-- Header -->
            <div class="flex justify-between items-center mb-8">
                <button onclick="changeMonth(-1)" class="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-full transition ${currentCalendarDate <= MIN_DATE ? 'opacity-50 cursor-not-allowed' : ''} text-gray-800 dark:text-gray-200">Previous</button>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                    ${monthNames[month]} ${year}
                </h2>
                <button onclick="changeMonth(1)" class="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-full transition ${currentCalendarDate >= MAX_DATE ? 'opacity-50 cursor-not-allowed' : ''} text-gray-800 dark:text-gray-200">Next</button>
            </div>

            <!-- Grid Header -->
            <div class="grid grid-cols-7 text-center font-bold text-gray-500 dark:text-gray-400 mb-4">
                <div>${currentLang === 'ar' ? 'احد' : 'Sun'}</div>
                <div>${currentLang === 'ar' ? 'اثنين' : 'Mon'}</div>
                <div>${currentLang === 'ar' ? 'ثلاثاء' : 'Tue'}</div>
                <div>${currentLang === 'ar' ? 'اربعاء' : 'Wed'}</div>
                <div>${currentLang === 'ar' ? 'خميس' : 'Thu'}</div>
                <div>${currentLang === 'ar' ? 'جمعة' : 'Fri'}</div>
                <div>${currentLang === 'ar' ? 'سبت' : 'Sat'}</div>
            </div>

            <!-- Days Grid -->
            <div class="grid grid-cols-7 gap-2 md:gap-4">
                ${daysHTML}
            </div>
        </div>
        
        <!-- Day Modal (Injected) -->
        <div id="dayModal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-blob dark:border dark:border-white/10">
                <button onclick="document.getElementById('dayModal').classList.add('hidden')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
                <h3 id="modalDateTitle" class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Date Details</h3>
                
                <div id="dayTransactionsList" class="mb-6 space-y-2 max-h-40 overflow-y-auto"></div>

                <form onsubmit="handleAddTransaction(event)" class="space-y-4 border-t dark:border-gray-700 pt-4">
                    <input type="hidden" name="date" id="modalDateInput">
                    <select name="type" class="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-white" required>
                        <option value="" disabled selected>Select Type</option>
                        <option value="debts">Debt (Red)</option>
                        <option value="assets">Asset (Blue)</option>
                        <option value="savings">Liquidity/Savings (Green)</option>
                        <option value="spending">Spending (Orange)</option>
                    </select>
                    <input type="text" name="name" placeholder="Item Name" required class="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-white">
                    <input type="number" name="amount" placeholder="Amount (EGP)" required class="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-white">
                    <input type="text" name="description" placeholder="Description (Optional)" class="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-white">
                    
                    <button type="submit" class="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg">Add Transaction</button>
                </form>
            </div>
        </div>
    `;

    // Ensure Day Modal is in DOM (it's in the main HTML, so it's fine)
    // But we need to make sure the changeMonth function re-calls renderCalendarInside not renderCalendar
    // Actually, changeMonth calls renderCalendar(). We need to update changeMonth to call renderFinance if that's the current view.
    // Or simpler: changeMonth updates state and calls loadSection('finance')/renderFinance()
}

// Override changeMonth to refresh finance view
function changeMonth(step) {
    const newDate = new Date(currentCalendarDate);
    newDate.setMonth(newDate.getMonth() + step);

    if (step < 0 && newDate < MIN_DATE) return;
    if (step > 0 && newDate > MAX_DATE) return;

    currentCalendarDate = newDate;
    // Refresh the finance view which contains the calendar
    loadSection('finance');
}

function createFinanceItemHTML(item, colorClass, category) {
    return `
        <div class="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-700/50 rounded-lg hover:bg-white/90 dark:hover:bg-gray-600/60 transition text-sm group frost-item">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                    <span class="${colorClass} font-bold text-sm">${parseFloat(item.amount).toLocaleString()} EGP</span>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 truncate">${item.name}</div>
            </div>
            <div class="flex items-center gap-1 ml-2">
                <button onclick="editFinanceItem('${category}', '${item.id}')" class="text-blue-400 hover:text-blue-600 transition p-1" title="Edit">
                    <i class="fa-solid fa-pen text-xs"></i>
                </button>
                <button onclick="deleteFinanceItem('${category}', '${item.id}')" class="text-red-400 hover:text-red-600 transition p-1" title="Delete">
                    <i class="fa-solid fa-trash text-xs"></i>
                </button>
            </div>
        </div>
    `;
}

// --- Finance Item Edit/Delete ---
function deleteFinanceItem(category, id) {
    const t = translations[currentLang];
    showModal({
        title: t.confirm,
        body: `<p>${t.deleteConfirm}</p>`,
        confirmText: currentLang === 'ar' ? 'حذف' : 'Delete',
        cancelText: t.cancel,
        onConfirm: () => {
            let list = userData[category] || [];
            list = list.filter(item => item.id !== id);
            saveData(category, list).then(() => renderFinance());
        }
    });
}

function editFinanceItem(category, id) {
    const t = translations[currentLang];
    let list = userData[category] || [];
    const item = list.find(i => i.id === id);
    if (!item) return;

    const inputs = `
        <form id="modalForm" class="space-y-3">
            <div>
                <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.itemName}</label>
                <input type="text" name="name" value="${item.name || ''}" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.amount}</label>
                <input type="number" name="amount" value="${item.amount || ''}" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
        </form>
    `;

    showModal({
        title: currentLang === 'ar' ? 'تعديل' : 'Edit',
        body: inputs,
        confirmText: currentLang === 'ar' ? 'حفظ' : 'Save',
        onConfirm: (data) => {
            if (!data) return;
            item.name = data.name;
            item.amount = data.amount;
            saveData(category, list).then(() => renderFinance());
        }
    });
}

// --- Buy & Sell Section ---
function renderBuySell() {
    const t = translations[currentLang];
    pageTitle.innerText = t.buySell;

    const buyItems = userData.buyList || [];
    const sellItems = userData.sellList || [];

    const totalBuy = buyItems.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
    const totalSell = sellItems.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);

    const createItemHTML = (item, listType, colorClass, index, total) => {
        const done = item.completed;
        const strikeClass = done ? 'line-through opacity-50' : '';
        return `
        <div class="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-700/50 rounded-lg hover:bg-white/90 dark:hover:bg-gray-600/60 transition frost-item ${done ? 'opacity-70' : ''}">
            <input type="checkbox" ${done ? 'checked' : ''} onchange="toggleBuySellItem('${listType}', '${item.id}')" class="w-4 h-4 rounded accent-indigo-500 cursor-pointer flex-shrink-0">
            <div class="flex-1 min-w-0">
                <div class="font-medium text-gray-800 dark:text-gray-200 text-sm truncate ${strikeClass}">${item.name}</div>
                <div class="${colorClass} font-bold text-sm ${strikeClass}">${parseFloat(item.amount).toLocaleString()} EGP</div>
            </div>
            <div class="flex items-center gap-0.5 ml-1 flex-shrink-0">
                <button onclick="moveBuySellItem('${listType}', '${item.id}', -1)" class="text-gray-400 hover:text-indigo-500 transition p-1 ${index === 0 ? 'invisible' : ''}" title="Move Up">
                    <i class="fa-solid fa-chevron-up text-xs"></i>
                </button>
                <button onclick="moveBuySellItem('${listType}', '${item.id}', 1)" class="text-gray-400 hover:text-indigo-500 transition p-1 ${index === total - 1 ? 'invisible' : ''}" title="Move Down">
                    <i class="fa-solid fa-chevron-down text-xs"></i>
                </button>
                <button onclick="editBuySellItem('${listType}', '${item.id}')" class="text-blue-400 hover:text-blue-600 transition p-1" title="Edit">
                    <i class="fa-solid fa-pen text-xs"></i>
                </button>
                <button onclick="deleteBuySellItem('${listType}', '${item.id}')" class="text-red-400 hover:text-red-600 transition p-1" title="Delete">
                    <i class="fa-solid fa-trash text-xs"></i>
                </button>
            </div>
        </div>
    `};

    contentArea.innerHTML = `
        <div class="grid gap-6 md:grid-cols-2">
            <!-- Buy List -->
            <div class="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50 dark:border-white/10 frost-card">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                        <i class="fa-solid fa-cart-shopping mr-2"></i>${t.buyList}
                    </h2>
                    <button onclick="openAddBuySellModal('buyList')" class="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition shadow-md text-sm font-bold">${t.addBuyItem}</button>
                </div>
                <div class="space-y-2 mb-4 max-h-96 overflow-y-auto" id="buyItemsList">
                    ${buyItems.length === 0 ? `<p class="text-gray-400 dark:text-gray-500 text-sm text-center py-4">${t.noBuyItems}</p>` :
            buyItems.map((item, i) => createItemHTML(item, 'buyList', 'text-emerald-600 dark:text-emerald-400', i, buyItems.length)).join('')}
                </div>
                <div class="pt-3 border-t border-gray-200/50 dark:border-white/10 flex justify-between items-center">
                    <span class="text-sm font-bold text-gray-600 dark:text-gray-400">${t.totalBuy}</span>
                    <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400">${totalBuy.toLocaleString()} EGP</span>
                </div>
            </div>

            <!-- Sell List -->
            <div class="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50 dark:border-white/10 frost-card">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-amber-700 dark:text-amber-400">
                        <i class="fa-solid fa-hand-holding-dollar mr-2"></i>${t.sellList}
                    </h2>
                    <button onclick="openAddBuySellModal('sellList')" class="bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 transition shadow-md text-sm font-bold">${t.addSellItem}</button>
                </div>
                <div class="space-y-2 mb-4 max-h-96 overflow-y-auto" id="sellItemsList">
                    ${sellItems.length === 0 ? `<p class="text-gray-400 dark:text-gray-500 text-sm text-center py-4">${t.noSellItems}</p>` :
            sellItems.map((item, i) => createItemHTML(item, 'sellList', 'text-amber-600 dark:text-amber-400', i, sellItems.length)).join('')}
                </div>
                <div class="pt-3 border-t border-gray-200/50 dark:border-white/10 flex justify-between items-center">
                    <span class="text-sm font-bold text-gray-600 dark:text-gray-400">${t.totalSell}</span>
                    <span class="text-lg font-bold text-amber-600 dark:text-amber-400">${totalSell.toLocaleString()} EGP</span>
                </div>
            </div>
        </div>
    `;
}

function openAddBuySellModal(listType) {
    const t = translations[currentLang];
    const isBuy = listType === 'buyList';
    const title = isBuy ? t.buyList : t.sellList;

    const inputs = `
        <form id="modalForm" class="space-y-3">
            <div>
                <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterItemName}</label>
                <input type="text" name="name" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterPrice}</label>
                <input type="number" name="amount" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
        </form>
    `;

    showModal({
        title: title,
        body: inputs,
        confirmText: t.add,
        onConfirm: (data) => {
            if (!data || !data.name || !data.amount) return;
            const newItem = {
                id: Date.now().toString(),
                name: data.name,
                amount: data.amount
            };
            let list = userData[listType] || [];
            list.push(newItem);
            saveData(listType, list).then(() => renderBuySell());
        }
    });
}

function editBuySellItem(listType, id) {
    const t = translations[currentLang];
    const list = userData[listType] || [];
    const item = list.find(i => i.id === id);
    if (!item) return;

    const isBuy = listType === 'buyList';
    const title = currentLang === 'ar' ? 'تعديل' : 'Edit';

    const inputs = `
        <form id="modalForm" class="space-y-3">
            <div>
                <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterItemName}</label>
                <input type="text" name="name" value="${item.name}" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterPrice}</label>
                <input type="number" name="amount" value="${item.amount}" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
        </form>
    `;

    showModal({
        title: title,
        body: inputs,
        confirmText: currentLang === 'ar' ? 'حفظ' : 'Save',
        onConfirm: (data) => {
            if (!data) return;
            item.name = data.name;
            item.amount = data.amount;
            saveData(listType, list).then(() => renderBuySell());
        }
    });
}

function deleteBuySellItem(listType, id) {
    const t = translations[currentLang];
    showModal({
        title: t.confirm,
        body: `<p>${t.deleteConfirm}</p>`,
        confirmText: t.confirm,
        cancelText: t.cancel,
        onConfirm: () => {
            let list = userData[listType] || [];
            list = list.filter(i => i.id !== id);
            userData[listType] = list;
            saveData(listType, list).then(() => renderBuySell());
        }
    });
}

function toggleBuySellItem(listType, id) {
    let list = userData[listType] || [];
    const item = list.find(i => i.id === id);
    if (!item) return;
    item.completed = !item.completed;
    saveData(listType, list).then(() => renderBuySell());
}

function moveBuySellItem(listType, id, direction) {
    let list = userData[listType] || [];
    const index = list.findIndex(i => i.id === id);
    if (index === -1) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= list.length) return;
    // Swap
    [list[index], list[newIndex]] = [list[newIndex], list[index]];
    userData[listType] = list;
    saveData(listType, list).then(() => renderBuySell());
}

// --- Navigation Logic ---
function loadSection(sectionId) {
    if (sectionId !== 'finance') {
        const calendarContainer = document.getElementById('calendarContainer');
        if (calendarContainer) calendarContainer.innerHTML = ''; // Clear calendar to avoid duplicates
    }

    // Save active section
    localStorage.setItem('activeSection', sectionId);

    // Sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(el => {
        el.classList.remove('bg-white/40', 'dark:bg-white/10', 'shadow-sm', 'border-l-4', 'border-indigo-500');
        el.classList.add('hover:bg-white/40', 'dark:hover:bg-white/10');
    });

    const activeNav = document.getElementById(`nav-${sectionId}`);
    if (activeNav) {
        activeNav.classList.remove('hover:bg-white/40', 'dark:hover:bg-white/10');
        activeNav.classList.add('bg-white/40', 'dark:bg-white/10', 'shadow-sm', 'border-l-4', 'border-indigo-500');
    }

    // Load content
    pageTitle.innerText = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

    if (sectionId === 'account') renderAccount();
    else if (sectionId === 'goals') renderGoals();
    else if (sectionId === 'tasks') renderTasks();
    else if (sectionId === 'events') renderEvents();
    else if (sectionId === 'obstacles') renderObstacles();
    else if (sectionId === 'finance') renderFinance();
    else if (sectionId === 'buysell') renderBuySell();

    // Mobile menu handling - close sidebar after selecting a section
    if (window.innerWidth < 768) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobileMenuOverlay');
        sidebar.classList.add('sidebar-closed');
        overlay.classList.remove('opacity-100', 'pointer-events-auto');
        overlay.classList.add('opacity-0', 'pointer-events-none');
    }
}

function openEditItemModal(type, id) {
    const t = translations[currentLang];
    const list = userData[type] || [];
    const item = list.find(i => i.id === id);
    if (!item) return;

    let title, body;
    let inputs = '';

    if (type === 'goals' || type === 'tasks') {
        title = type === 'goals' ? t.goals : t.tasks; // Simplified title for edit
        const label = type === 'goals' ? t.enterGoalName : t.enterTaskName;
        inputs = `
            <form id="modalForm">
                <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${label}</label>
                <input type="text" name="title" value="${item.title}" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
            </form>
        `;
    } else if (type === 'events') {
        title = t.addEvent.replace('+', '').trim(); // "Add Event" -> "Event" roughly, or just use translated "Events"
        inputs = `
            <form id="modalForm" class="space-y-3">
                <div>
                     <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterEventName}</label>
                     <input type="text" name="title" value="${item.title}" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-pink-500 outline-none">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                         <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterStartDate}</label>
                         <input type="date" name="startDate" value="${item.startDate}" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                         <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterEndDate}</label>
                         <input type="date" name="endDate" value="${item.endDate}" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                </div>
            </form>
        `;
    } else if (type === 'obstacles') {
        title = t.obstacles;
        inputs = `
             <form id="modalForm" class="space-y-3">
                <div>
                     <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterObstacleName}</label>
                     <input type="text" name="title" value="${item.title}" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 outline-none">
                </div>
                <div>
                     <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterDescription}</label>
                     <textarea name="description" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows="2">${item.description || ''}</textarea>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                         <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterStartDate}</label>
                         <input type="date" name="startDate" value="${item.startDate}" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                    <div>
                         <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.enterEndDate}</label>
                         <input type="date" name="endDate" value="${item.endDate || ''}" class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    </div>
                </div>
            </form>
        `;
    }

    showModal({
        title: currentLang === 'ar' ? 'تعديل' : 'Edit',
        body: inputs,
        confirmText: currentLang === 'ar' ? 'حفظ' : 'Save',
        onConfirm: (data) => {
            if (!data) return;
            // Update item properties
            Object.assign(item, data);

            saveData(type, list).then(() => {
                if (type === 'goals') renderGoals();
                else if (type === 'tasks') renderTasks();
                else if (type === 'events') renderEvents();
                else if (type === 'obstacles') renderObstacles();
            });
        }
    });
}
// --- Modal System (fresh DOM lookups every time) ---
function closeModal() {
    console.log('[closeModal] Closing modal');
    const m = document.getElementById('universalModal');
    if (m) m.classList.add('hidden');
}

function showModal({ title, body, confirmText, cancelText, onConfirm }) {
    console.log('[showModal] Opening modal:', title);

    const m = document.getElementById('universalModal');
    const mTitle = document.getElementById('modalTitle');
    const mBody = document.getElementById('modalBody');
    const mCancel = document.getElementById('modalCancel');
    const mConfirm = document.getElementById('modalConfirm');

    if (!m || !mTitle || !mBody || !mCancel || !mConfirm) {
        console.error('[showModal] ERROR: Modal DOM elements not found!', { m, mTitle, mBody, mCancel, mConfirm });
        return;
    }

    // Set content
    mTitle.innerText = title;
    mBody.innerHTML = body || '';

    // Translations for fallback
    const t = translations[currentLang];
    mCancel.innerText = cancelText || t.cancel;

    if (cancelText === false) {
        mCancel.classList.add('hidden');
    } else {
        mCancel.classList.remove('hidden');
    }

    // Replace Confirm Button to clear old listeners
    const newConfirm = mConfirm.cloneNode(true);
    newConfirm.id = 'modalConfirm'; // Ensure ID is preserved
    newConfirm.innerText = confirmText || t.confirm;
    mConfirm.parentNode.replaceChild(newConfirm, mConfirm);

    newConfirm.addEventListener('click', function handleConfirm() {
        console.log('[showModal] Confirm button clicked');
        const formEl = document.getElementById('modalBody');
        const form = formEl ? formEl.querySelector('form') : null;
        let data = null;

        if (form) {
            if (form.checkValidity()) {
                const formData = new FormData(form);
                data = Object.fromEntries(formData.entries());
                console.log('[showModal] Form data collected:', data);
            } else {
                form.reportValidity();
                console.log('[showModal] Form validation failed');
                return; // Stop if invalid
            }
        }

        if (onConfirm) {
            console.log('[showModal] Calling onConfirm callback');
            onConfirm(data);
        }
        closeModal();
    });

    // Show the modal
    m.classList.remove('hidden');
    console.log('[showModal] Modal is now visible');
}

function openFinanceModal(type) {
    const t = translations[currentLang];
    const isSavings = type === 'savings';

    // Determine labels based on type
    let titleText = '';
    if (type === 'debts') titleText = currentLang === 'ar' ? 'اضافة دين' : 'Add Debt';
    else if (type === 'assets') titleText = currentLang === 'ar' ? 'اضافة اصل' : 'Add Asset';
    else if (type === 'savings') titleText = currentLang === 'ar' ? 'اضافة مدخرات' : 'Add Savings';
    else titleText = currentLang === 'ar' ? 'اضافة مصروف' : 'Add Expense';

    const inputs = `
        <form id="modalForm" class="space-y-4">
            <div>
                 <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${isSavings ? t.description : t.itemName}</label>
                 <input type="text" name="name" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
             <div>
                 <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${t.amount}</label>
                 <input type="number" name="amount" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
        </form>
    `;

    showModal({
        title: titleText,
        body: inputs,
        confirmText: t.add,
        onConfirm: (data) => {
            if (!data) return; // Should be handled by checkValidity but safe check
            const newItem = {
                id: Date.now().toString(),
                name: data.name,
                amount: parseFloat(data.amount),
                date: new Date().toLocaleDateString('en-GB'),
                source: 'manual'
            };

            let list = userData[type] || [];
            list.push(newItem);

            saveData(type, list).then(() => renderFinance());
        }
    });
}


// --- Common Helpers ---

async function deleteItem(type, id) {
    const t = translations[currentLang];

    showModal({
        title: t.confirm,
        body: `<p>${t.deleteConfirm}</p>`,
        confirmText: currentLang === 'ar' ? 'حذف' : 'Delete',
        cancelText: t.cancel,
        onConfirm: async () => {
            let list = userData[type] || [];
            list = list.filter(i => i.id !== id);
            await saveData(type, list);

            if (type === 'goals') renderGoals();
            if (type === 'tasks') renderTasks();
            if (type === 'events') renderEvents();
            if (type === 'obstacles') renderObstacles();
            if (['debts', 'assets', 'savings', 'spending'].includes(type)) {
                renderFinance();
            }
        }
    });
}

function openAddItemModal(type) {
    console.log('[openAddItemModal] Called with type:', type);
    const t = translations[currentLang];
    const promptText = type === 'goal' ? t.enterGoalName : t.enterTaskName;
    const titleText = type === 'goal' ? (currentLang === 'ar' ? 'اضافة هدف' : 'Add Goal') : (currentLang === 'ar' ? 'اضافة مهمة' : 'Add Task');

    const inputs = `
        <form id="modalForm">
            <label class="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">${promptText}</label>
            <input type="text" name="title" required class="w-full p-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
        </form>
    `;

    showModal({
        title: titleText,
        body: inputs,
        confirmText: t.add,
        onConfirm: (data) => {
            console.log('[openAddItemModal] onConfirm called, data:', data);
            if (!data || !data.title) {
                console.error('[openAddItemModal] No title provided');
                return;
            }
            const newItem = { id: Date.now().toString(), title: data.title, completed: false };
            let category = type === 'goal' ? 'goals' : 'tasks';

            let list = userData[category] || [];
            list.push(newItem);
            console.log('[openAddItemModal] Saving', category, 'with', list.length, 'items');
            saveData(category, list).then(() => {
                console.log('[openAddItemModal] Save complete, re-rendering', category);
                if (category === 'goals') renderGoals();
                else renderTasks();
            });
        }
    });
}

function triggerConfetti() {
    const congratsMsg = currentLang === 'ar' ? '🎉 مبروك! حققت هدفك!' : '🎉 Congratulations! Goal Achieved!';
    const subMsg = currentLang === 'ar' ? 'استمر في التقدم!' : 'Keep up the great work!';
    const btnText = currentLang === 'ar' ? 'يلا نكمل! 💪' : "Let's Go! 💪";

    // --- Confetti Canvas ---
    const canvas = document.createElement('canvas');
    canvas.id = 'confettiCanvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1', '#FFE66D', '#FF9FF3', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#00B894', '#E17055'];
    const pieces = [];

    for (let i = 0; i < 120; i++) {
        const fromLeft = i % 2 === 0;
        pieces.push({
            x: fromLeft ? Math.random() * canvas.width * 0.3 : canvas.width - Math.random() * canvas.width * 0.3,
            y: -Math.random() * 200 - 20,
            w: Math.random() * 10 + 4,
            h: Math.random() * 6 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 0.5 + 0.3,
            gravity: 0.008 + Math.random() * 0.005,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 4,
            wobble: Math.random() * 8,
            wobbleSpeed: Math.random() * 0.03 + 0.01,
            opacity: 1,
            delay: Math.random() * 120,
            shape: Math.random() > 0.3 ? 'rect' : 'circle'
        });
    }

    let frame = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        pieces.forEach(p => {
            if (frame < p.delay) { alive = true; return; }
            p.vy += p.gravity;
            if (p.vy > 1.5) p.vy = 1.5;
            p.vx *= 0.998;
            p.x += p.vx + Math.sin(frame * p.wobbleSpeed) * p.wobble * 0.08;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;

            if (p.y > canvas.height + 30) p.opacity -= 0.01;
            if (p.opacity <= 0) return;
            alive = true;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            if (p.shape === 'rect') {
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.w / 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        frame++;
        if (alive && frame < 900) {
            requestAnimationFrame(animate);
        } else {
            if (canvas.parentElement) canvas.remove();
        }
    }
    animate();

    // --- Congrats Popup Card ---
    const popup = document.createElement('div');
    popup.id = 'congratsPopup';
    popup.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;display:flex;align-items:center;justify-content:center;';

    const card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-radius:24px;border:1px solid rgba(255,255,255,0.6);box-shadow:0 20px 60px rgba(0,0,0,0.15);padding:40px 48px;text-align:center;max-width:380px;animation:congratsIn 0.5s cubic-bezier(0.34,1.56,0.64,1);';

    const emoji = document.createElement('div');
    emoji.textContent = '🏆';
    emoji.style.cssText = 'font-size:64px;margin-bottom:16px;animation:congratsBounce 0.6s ease 0.3s both;';

    const title = document.createElement('h2');
    title.textContent = congratsMsg;
    title.style.cssText = 'font-size:22px;font-weight:800;margin-bottom:8px;background:linear-gradient(135deg,#6366f1,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;';

    const sub = document.createElement('p');
    sub.textContent = subMsg;
    sub.style.cssText = 'color:#64748b;font-size:14px;margin-bottom:20px;';

    const btn = document.createElement('button');
    btn.textContent = btnText;
    btn.style.cssText = 'background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;padding:10px 32px;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 4px 12px rgba(99,102,241,0.3);transition:transform 0.2s;';
    btn.addEventListener('mouseover', function () { this.style.transform = 'scale(1.05)'; });
    btn.addEventListener('mouseout', function () { this.style.transform = 'scale(1)'; });
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var p = document.getElementById('congratsPopup');
        if (p) p.remove();
    });

    card.appendChild(emoji);
    card.appendChild(title);
    card.appendChild(sub);
    card.appendChild(btn);
    popup.appendChild(card);
    document.body.appendChild(popup);

    // Auto dismiss after 12 seconds
    setTimeout(function () {
        var el = document.getElementById('congratsPopup');
        if (el && el.parentElement) {
            el.style.transition = 'opacity 0.5s';
            el.style.opacity = '0';
            setTimeout(function () { if (el.parentElement) el.remove(); }, 500);
        }
    }, 12000);
}
