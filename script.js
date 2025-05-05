document.addEventListener('DOMContentLoaded', () => {
    // Sample Admin User (for demonstration)
    const adminUser = {
        username: 'admin',
        password: 'password123'
    };

    // Function to save data to local storage
    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Function to load data from local storage
    function loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    // --- Home Page Logic ---
    const parentLoginBtn = document.getElementById('parentLoginBtn');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const parentLoginForm = document.getElementById('parentLoginForm');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const parentLoginFormSubmit = document.getElementById('parentLoginFormSubmit');
    const adminLoginFormSubmit = document.getElementById('adminLoginFormSubmit');

    if (parentLoginBtn && adminLoginBtn && parentLoginForm && adminLoginForm) {
        parentLoginBtn.addEventListener('click', () => {
            parentLoginForm.style.display = 'block';
            adminLoginForm.style.display = 'none';
        });

        adminLoginBtn.addEventListener('click', () => {
            adminLoginForm.style.display = 'block';
            parentLoginForm.style.display = 'none';
        });
    }

    if (parentLoginFormSubmit) {
        parentLoginFormSubmit.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('parentPhone').value;
            const password = document.getElementById('parentPassword').value;
            const registeredParents = loadData('parents') || [];
            const parent = registeredParents.find(p => p.phone === phone && p.password === password);

            if (parent) {
                saveData('currentUser', { type: 'parent', phone: parent.phone, childAge: parent.childAge, parentName: parent.parentFullName });
                redirectToChildInterface(parent.childAge);
            } else {
                alert('Invalid phone number or password. Please register.');
            }
        });
    }

    if (adminLoginFormSubmit) {
        adminLoginFormSubmit.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;

            if (username === adminUser.username && password === adminUser.password) {
                saveData('currentUser', { type: 'admin' });
                window.location.href = 'admin_dashboard.html';
            } else {
                alert('Invalid admin username or password.');
            }
        });
    }

    // --- Registration Page Logic ---
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const parentFullName = document.getElementById('parentFullName').value;
            const parentPhone = document.getElementById('parentPhone').value;
            const parentPassword = document.getElementById('parentPassword').value;
            const childFullName = document.getElementById('childFullName').value;
            const childAge = document.getElementById('childAge').value;

            const newParent = {
                parentFullName,
                phone: parentPhone,
                password: parentPassword,
                childFullName,
                childAge
            };

            const existingParents = loadData('parents') || [];
            existingParents.push(newParent);
            saveData('parents', existingParents);
            alert('Registration successful! Please log in on the home page.');
            window.location.href = 'index.html';
        });
    }

    // --- Parent Dashboard Logic ---
    const parentDashboardPage = document.querySelector('.dashboard-page');
    if (parentDashboardPage) {
        const currentUser = loadData('currentUser');
        const parentNameDisplay = document.getElementById('parentNameDisplay');
        const logoutBtn = document.getElementById('logoutBtn');

        if (currentUser && currentUser.type === 'parent' && parentNameDisplay) {
            parentNameDisplay.textContent = currentUser.parentName;
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }
    }

    // --- Admin Dashboard Logic ---
    const adminDashboardPage = document.querySelector('.admin-dashboard-page');
    if (adminDashboardPage) {
        const logoutBtn = document.getElementById('adminLogoutBtn');
        const addContentForm = document.getElementById('addContentForm');
        const contentListDiv = document.getElementById('contentList');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }

        if (addContentForm) {
            addContentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const ageGroup = document.getElementById('ageGroup').value;
                const pageType = document.getElementById('pageType').value;
                const pageTitle = document.getElementById('pageTitle').value;

                const newContent = { ageGroup, type: pageType, title: pageTitle };
                const existingContent = loadData('content') || [];
                existingContent.push(newContent);
                saveData('content', existingContent);
                displayContentList();
                addContentForm.reset();
            });
        }

        function displayContentList() {
            const content = loadData('content') || [];
            if (contentListDiv) {
                if (content.length > 0) {
                    contentListDiv.innerHTML = '<h3>Current Content Pages</h3><ul>' +
                        content.map(item => `<li>${item.ageGroup} - ${item.type}: ${item.title}</li>`).join('') +
                        '</ul>';
                } else {
                    contentListDiv.innerHTML = '<p>No content added yet.</p>';
                }
            }
        }

        displayContentList(); // Initial display
    }

    // --- Child Interface Logic (Beginner, Intermediate, Expert) ---
    const childInterfacePages = document.querySelectorAll('.child-interface');
    childInterfacePages.forEach(childInterface => {
        const logoutBtn = childInterface.querySelector('#logoutBtn');
        const currentUser = loadData('currentUser');
        let timerDuration;

        if (currentUser && currentUser.type === 'parent') {
            if (currentUser.childAge === '2-4') {
                timerDuration = 30 * 60 * 1000; // 30 minutes
            } else if (currentUser.childAge === '4-7') {
                timerDuration = 90 * 60 * 1000; // 1 hour 30 minutes
            } else if (currentUser.childAge === '7-10') {
                timerDuration = 150 * 60 * 1000; // 2 hours 30 minutes
            }

            if (timerDuration) {
                setTimeout(() => {
                    localStorage.removeItem('currentUser');
                    alert('Your session has timed out.');
                    window.location.href = 'index.html';
                }, timerDuration);
            }
        } else {
            // Redirect if not logged in as a parent
            window.location.href = 'index.html';
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }
    });

    // --- Helper Function to Redirect to Child Interface ---
    function redirectToChildInterface(ageGroup) {
        if (ageGroup === '2-4') {
            window.location.href = 'beginner.html';
        } else if (ageGroup === '4-7') {
            window.location.href = 'intermediate.html';
        } else if (ageGroup === '7-10') {
            window.location.href = 'expert.html';
        }
    }

    // --- Check Login on Child Interface Pages ---
    const beginnerPage = document.querySelector('.beginner-interface');
    const intermediatePage = document.querySelector('.intermediate-interface');
    const expertPage = document.querySelector('.expert-interface');

    if (beginnerPage || intermediatePage || expertPage) {
        const currentUser = loadData('currentUser');
        if (!currentUser || currentUser.type !== 'parent') {
            window.location.href = 'index.html';
        } else {
            const currentAgeGroup = currentUser.childAge;
            const onBeginner = window.location.pathname.includes('beginner.html');
            const onIntermediate = window.location.pathname.includes('intermediate.html');
            const onExpert = window.location.pathname.includes('expert.html');

            if (
                (currentAgeGroup === '2-4' && !onBeginner) ||
                (currentAgeGroup === '4-7' && !onIntermediate) ||
                (currentAgeGroup === '7-10' && !onExpert)
            ) {
                redirectToChildInterface(currentAgeGroup);
            }
        }
    }
});