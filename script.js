document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon'); // Get the icon element
    const body = document.body;
    const milestoneNameEl = document.getElementById('milestone-name');
    const milestoneDateFromEl = document.getElementById('milestone-date-from');
    const milestoneDateToEl = document.getElementById('milestone-date-to');
    const remainingTimeEl = document.getElementById('remaining-time');
    const spentTimeEl = document.getElementById('spent-time');
    const whatToReadBtn = document.getElementById('what-to-read-btn');
    const readPopup = document.getElementById('read-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const expandAllBtn = document.getElementById('expand-all-btn');
    const collapseAllBtn = document.getElementById('collapse-all-btn');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const accordionItems = document.querySelectorAll('.accordion-item');

    // --- Milestone Dates (You can change these!) ---
    // Updated dates: From 14th May 2025 to 31st July 2025
    const MILESTONE_START_DATE = new Date('2025-05-14T00:00:00');
    const MILESTONE_END_DATE = new Date('2025-07-31T23:59:59'); // Set to end of day for full day count

    // Update Milestone Display
    milestoneDateFromEl.textContent = MILESTONE_START_DATE.toLocaleDateString('en-CA'); //YYYY-MM-DD
    milestoneDateToEl.textContent = MILESTONE_END_DATE.toLocaleDateString('en-CA'); //YYYY-MM-DD

    // --- Clock Update Function ---
    function updateClocks() {
        const now = new Date();
        
        // Convert to milliseconds for calculations
        const msPerSecond = 1000;
        const msPerMinute = msPerSecond * 60;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;

        // --- Remaining Time ---
        let remainingDuration = MILESTONE_END_DATE.getTime() - now.getTime(); // Milliseconds from now to end

        let remDays = 0;
        let remHours = 0;
        let remMinutes = 0;
        let remSeconds = 0;

        if (remainingDuration > 0) {
            // Calculate total seconds remaining
            const totalRemainingSeconds = Math.floor(remainingDuration / msPerSecond);

            // Calculate exact hours, minutes, seconds within the current day
            remSeconds = totalRemainingSeconds % 60;
            remMinutes = Math.floor(totalRemainingSeconds / 60) % 60;
            remHours = Math.floor(totalRemainingSeconds / (60 * 60)) % 24;

            // Calculate days inclusively for Remaining Time
            remDays = Math.floor(remainingDuration / msPerDay);
            if (remainingDuration % msPerDay > 0 || totalRemainingSeconds === 0) {
                remDays += 1;
            }
            remDays = Math.max(0, remDays);

        } else {
            // Milestone has ended
            remDays = 0;
            remHours = 0;
            remMinutes = 0;
            remSeconds = 0;
        }

        // Format for display: "Xd HH:MM:SS" (X is only shown if > 0)
        remainingTimeEl.textContent =
            `${remDays > 0 ? remDays + 'd ' : ''}` +
            `${String(remHours).padStart(2, '0')}:${String(remMinutes).padStart(2, '0')}:${String(remSeconds).padStart(2, '0')}`;


        // --- Spent Time ---
        let spentDuration = now.getTime() - MILESTONE_START_DATE.getTime(); // Milliseconds from start to now

        let spentDays = 0;
        let spentHours = 0;
        let spentMinutes = 0;
        let spentSeconds = 0;

        if (spentDuration > 0) {
            // Calculate total seconds spent
            const totalSpentSeconds = Math.floor(spentDuration / msPerSecond);

            // Calculate exact hours, minutes, seconds within the current day
            spentSeconds = totalSpentSeconds % 60;
            spentMinutes = Math.floor(totalSpentSeconds / 60) % 60;
            spentHours = Math.floor(totalSpentSeconds / (60 * 60)) % 24;

            // Calculate days inclusively, then subtract 1 as requested
            spentDays = Math.floor(spentDuration / msPerDay);
            if (spentDuration % msPerDay > 0 || totalSpentSeconds === 0) {
                spentDays += 1;
            }
            spentDays = Math.max(0, spentDays - 1); // Subtract 1 day and ensure it doesn't go below 0

        } else {
            // Milestone has not started yet
            spentDays = 0;
            spentHours = 0;
            spentMinutes = 0;
            spentSeconds = 0;
        }

        // Format for display: "Xd HH:MM:SS" (X is only shown if > 0)
        spentTimeEl.textContent =
            `${spentDays > 0 ? spentDays + 'd ' : ''}` +
            `${String(spentHours).padStart(2, '0')}:${String(spentMinutes).padStart(2, '0')}:${String(spentSeconds).padStart(2, '0')}`;
    }

    // Update clocks every second
    setInterval(updateClocks, 1000);
    // Initial call to display immediately
    updateClocks();

    // --- Theme Toggle Logic ---
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        // Save user's preference to localStorage
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-sun'); // Change icon to moon when dark
            themeIcon.classList.add('fa-moon');
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-moon'); // Change icon to sun when light
            themeIcon.classList.add('fa-sun');
        }
    });

    // Load saved theme preference on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-sun'); // Set initial icon based on saved theme
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon'); // Ensure correct icon for light theme on load
        themeIcon.classList.add('fa-sun');
    }

    // --- Popup and Accordion Logic ---
    whatToReadBtn.addEventListener('click', () => {
        readPopup.classList.add('active');
    });

    closePopupBtn.addEventListener('click', () => {
        readPopup.classList.remove('active');
    });

    // Close popup if user clicks outside of the content
    readPopup.addEventListener('click', (event) => {
        if (event.target === readPopup) {
            readPopup.classList.remove('active');
        }
    });

    // Accordion functionality for "What to Read" popup
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.closest('.accordion-item');
            accordionItem.classList.toggle('active');

            // Optional: Close other open accordions
            accordionHeaders.forEach(otherHeader => {
                const otherAccordionItem = otherHeader.closest('.accordion-item');
                if (otherAccordionItem !== accordionItem && otherAccordionItem.classList.contains('active')) {
                    otherAccordionItem.classList.remove('active');
                }
            });
        });
    });

    // Expand All button functionality
    expandAllBtn.addEventListener('click', () => {
        accordionItems.forEach(item => {
            item.classList.add('active');
        });
    });

    // Collapse All button functionality
    collapseAllBtn.addEventListener('click', () => {
        accordionItems.forEach(item => {
            item.classList.remove('active');
        });
    });
});