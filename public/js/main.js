document.addEventListener('DOMContentLoaded', () => {
    // Target Date: 01/12/2026
    // Assuming format DD/MM/YYYY, so December 1st, 2026
    const targetDate = new Date('2026-12-01T00:00:00');

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            // Timer finished
            return;
        }

        // Calculate time units
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Calculate months and weeks roughly or precise? 
        // Request said: Months - Weeks - Days - Hours - Minutes - Seconds
        // A precise calc is tricky with months being variable. 
        // Let's use a library-free approach approximating or using date diffs.

        // precise diff:
        let d1 = new Date(now);
        let d2 = new Date(targetDate);

        let m = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
        if (d2.getDate() < d1.getDate()) {
            m--;
        }

        // subtract months from diff to get remaining milliseconds for weeks/days?
        // Simpler approach for visual:
        // Just show total days or break it down?
        // The prompt asked for: Months - Weeks - Days - Hours - Minutes - Seconds

        // Let's do a rough breakdown for the display to be stable
        // This is complex without a lib like date-fns, but let's approximate:
        // 1 Month = 30.44 days

        const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const months = Math.floor(totalDays / 30.4375);
        const remainingDaysAfterMonths = totalDays - Math.floor(months * 30.4375);

        const weeks = Math.floor(remainingDaysAfterMonths / 7);
        const daysLeft = Math.floor(remainingDaysAfterMonths % 7);

        updateElement('months', months);
        updateElement('weeks', weeks);
        updateElement('days', daysLeft);
        updateElement('hours', hours);
        updateElement('minutes', minutes);
        updateElement('seconds', seconds);
    }

    function updateElement(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = value < 10 ? '0' + value : value;
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Auth Persistence Check
    const userJson = localStorage.getItem('user');
    if (userJson) {
        const navContainer = document.querySelector('nav .flex.gap-4');
        if (navContainer) {
            navContainer.innerHTML = `
                <a href="/dashboard.html" class="bg-white/20 glass px-6 py-2 rounded-full hover:bg-white/30 transition flex items-center gap-2">
                    <span>👤</span> Go to Dashboard
                </a>
            `;
        }
    }
});
