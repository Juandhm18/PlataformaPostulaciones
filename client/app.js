const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user') || '{}');

// Init
document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        showDashboard();
    } else {
        showLogin();
    }
});

// Navigation
function showLogin() {
    hideAll();
    document.getElementById('authForms').classList.remove('hidden');
    document.getElementById('formTitle').innerText = 'Login';
    document.getElementById('authType').value = 'login';
    document.getElementById('nameField').style.display = 'none';
    document.getElementById('roleField').style.display = 'none';
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('userSection').classList.add('hidden');
}

function showRegister() {
    showLogin();
    document.getElementById('formTitle').innerText = 'Register';
    document.getElementById('authType').value = 'register';
    document.getElementById('nameField').style.display = 'block';

    // Only show role selection if needed, keeping it simple for now (default coder)
    // Or allow selecting role for testing purposes as per request requirements implies easy testing.
    // "El rol por defecto al registrarse será coder" -> But creating admin/gestor is via Seeders.
    // However, for testing "Crear vacantes", I might need to login as Gestor. 
    // Seeders created 'gestor@riwi.io' / 'gestor123'. I will use that for Manager testing.
    // So Registration is mainly for Coders.
}

function showDashboard() {
    hideAll();
    document.getElementById('vacancySection').classList.remove('hidden');
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('userSection').classList.remove('hidden');
    document.getElementById('userName').innerText = `${currentUser.name} (${currentUser.role})`;

    if (currentUser.role === 'gestor' || currentUser.role === 'admin') {
        document.getElementById('createVacancyBtn').classList.remove('hidden');
    }

    // Show Applications section for everyone
    document.getElementById('applicationsSection').classList.remove('hidden');

    fetchVacancies();
    fetchApplications();
}

function hideAll() {
    document.getElementById('authForms').classList.add('hidden');
    document.getElementById('vacancySection').classList.add('hidden');
    document.getElementById('applicationsSection').classList.add('hidden');
    document.getElementById('messageBox').classList.add('hidden');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    token = null;
    currentUser = {};
    showLogin();
}

// Auth Logic
async function handleAuth(e) {
    e.preventDefault();
    const type = document.getElementById('authType').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;

    const endpoint = type === 'login' ? '/auth/login' : '/auth/register';
    const body = type === 'login' ? { email, password } : { email, password, name, role: 'coder' };

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (data.success || res.ok) { // Adjust based on interceptor response structure
            const responseData = data.data || data; // Handle both intercepted and raw if interceptor fails
            if (type === 'login') {
                token = responseData.access_token;
                currentUser = responseData.user;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(currentUser));
                showDashboard();
            } else {
                showMessage('Registered successfully! Please login.', 'green');
                showLogin();
            }
        } else {
            showMessage(data.message || 'Error', 'red');
        }
    } catch (err) {
        showMessage(err.message, 'red');
    }
}

// Vacancies Logic
async function fetchVacancies() {
    try {
        const res = await fetch(`${API_URL}/vacancies`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        renderVacancies(result.data || []);
    } catch (err) {
        console.error(err);
    }
}

function renderVacancies(vacancies) {
    const grid = document.getElementById('vacanciesGrid');
    grid.innerHTML = vacancies.map(v => `
        <div class="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <div class="flex justify-between">
                <h3 class="font-bold text-xl">${v.title}</h3>
                <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">${v.modality}</span>
            </div>
            <p class="text-gray-600 mb-2">${v.company} - ${v.location}</p>
            <p class="text-gray-500 text-sm mb-4">${v.description.substring(0, 100)}...</p>
            <div class="flex justify-between items-center mt-auto">
                <span class="text-green-600 font-bold">${v.salaryRange}</span>
                ${currentUser.role === 'coder' ?
            `<button onclick="applyToVacancy('${v.id}')" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Apply</button>` :
            `<span class="text-gray-400">Manage as Gestor</span>`
        }
            </div>
        </div>
    `).join('');
}

// Create Vacancy
function showCreateVacancy() {
    document.getElementById('createVacancyForm').classList.remove('hidden');
}
function hideCreateVacancy() {
    document.getElementById('createVacancyForm').classList.add('hidden');
}

async function handleCreateVacancy(e) {
    e.preventDefault();
    const vacancy = {
        title: document.getElementById('vTitle').value,
        description: document.getElementById('vDesc').value,
        technologies: document.getElementById('vTech').value,
        company: document.getElementById('vCompany').value,
        location: document.getElementById('vLoc').value,
        seniority: document.getElementById('vSeniority').value,
        softSkills: document.getElementById('vSoft').value,
        salaryRange: document.getElementById('vSal').value,
        modality: document.getElementById('vMod').value,
        maxApplicants: parseInt(document.getElementById('vMax').value),
    };

    try {
        const res = await fetch(`${API_URL}/vacancies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(vacancy)
        });
        const data = await res.json();
        if (data.success) {
            showMessage('Vacancy created!', 'green');
            hideCreateVacancy();
            fetchVacancies();
        } else {
            showMessage(data.message, 'red');
        }
    } catch (err) {
        showMessage(err.message, 'red');
    }
}

// Application Logic
async function applyToVacancy(vacancyId) {
    try {
        const res = await fetch(`${API_URL}/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ vacancyId })
        });
        const data = await res.json();
        if (data.success || res.ok) {
            showMessage('Applied successfully!', 'green');
            fetchApplications();
        } else {
            showMessage(data.message, 'red');
        }
    } catch (err) {
        showMessage(err.message, 'red');
    }
}

async function fetchApplications() {
    try {
        const res = await fetch(`${API_URL}/applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        renderApplications(result.data || []);
    } catch (err) {
        console.error(err);
    }
}

function renderApplications(apps) {
    const grid = document.getElementById('applicationsGrid');
    if (apps.length === 0) {
        grid.innerHTML = '<p class="text-gray-500">No applications found.</p>';
        return;
    }
    grid.innerHTML = apps.map(app => `
        <div class="bg-gray-50 p-4 rounded border flex justify-between items-center">
            <div>
                <h4 class="font-bold">${app.vacancy.title}</h4>
                <p class="text-sm text-gray-600">${app.vacancy.company}</p>
            </div>
            <span class="text-xs text-gray-500">Applied on: ${new Date(app.appliedAt).toLocaleDateString()}</span>
        </div>
    `).join('');
}

function showMessage(msg, color) {
    const box = document.getElementById('messageBox');
    box.classList.remove('hidden');
    box.classList.remove('bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
    box.classList.add(`bg-${color}-100`, `text-${color}-700`);
    box.innerText = msg;
    setTimeout(() => box.classList.add('hidden'), 3000);
}
