
const API_URL = 'http://localhost:5000/predict';

const STORAGE_KEYS = {
    USER: 'carPrice_user',
    HISTORY: 'carPrice_history',
    IS_LOGGED_IN: 'carPrice_loggedIn'
};

// Popular car suggestions
const POPULAR_CARS = [
    { brand: 'Tesla', model: 'Model 3' },
    { brand: 'Tesla', model: 'Model Y' },
    { brand: 'Tesla', model: 'Model S' },
    { brand: 'Tesla', model: 'Model X' },
    { brand: 'BMW', model: 'X5' },
    { brand: 'BMW', model: '3 Series' },
    { brand: 'BMW', model: '5 Series' },
    { brand: 'Audi', model: 'A4' },
    { brand: 'Audi', model: 'Q5' },
    { brand: 'Audi', model: 'Q7' },
    { brand: 'Mercedes', model: 'C-Class' },
    { brand: 'Mercedes', model: 'E-Class' },
    { brand: 'Mercedes', model: 'GLC' },
    { brand: 'Toyota', model: 'Camry' },
    { brand: 'Toyota', model: 'Corolla' },
    { brand: 'Toyota', model: 'RAV4' },
    { brand: 'Honda', model: 'Civic' },
    { brand: 'Honda', model: 'Accord' },
    { brand: 'Ford', model: 'Mustang' },
    { brand: 'Ford', model: 'F-150' },
    { brand: 'Porsche', model: '911' },
    { brand: 'Ferrari', model: '488' },
    { brand: 'Lamborghini', model: 'Huracan' }
];

// ========== AUTHENTICATION ==========

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'dashboard.html') {
        checkAuth();
        loadUserInfo();
        loadPredictionHistory();
        updateStats();
        loadSuggestions();
    }
    
    if (currentPage === 'login.html') {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    }
    
    if (currentPage === 'index.html') {
        const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
        if (isLoggedIn === 'true') {
            const loginBtn = document.querySelector('.navbar .btn-primary');
            if (loginBtn) {
                loginBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i> Dashboard';
                loginBtn.href = 'dashboard.html';
            }
        }
    }
    
    const predictionForm = document.getElementById('predictionForm');
    if (predictionForm) {
        predictionForm.addEventListener('submit', handlePrediction);
    }
});

// Load suggestions
function loadSuggestions() {
    const suggestionsDiv = document.getElementById('suggestionsList');
    if (!suggestionsDiv) return;
    
    // Random 6 suggestions
    const randomSuggestions = [...POPULAR_CARS]
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
    
    suggestionsDiv.innerHTML = randomSuggestions.map(car => `
        <div class="tag" onclick="fillSuggestion('${car.brand}', '${car.model}')">
            ${car.brand} ${car.model}
            <i class="fas fa-mouse-pointer"></i>
        </div>
    `).join('');
}

// Fill suggestion into form
function fillSuggestion(brand, model) {
    document.getElementById('brand').value = brand;
    document.getElementById('model').value = model;
    document.getElementById('brand').focus();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
            email: email,
            name: email.split('@')[0],
            loginTime: new Date().toISOString()
        }));
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
        window.location.href = 'dashboard.html';
    } else {
        showAlert('Please enter email and password', 'error');
    }
}

function checkAuth() {
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    const userSpan = document.getElementById('userEmail');
    if (userSpan && user.email) {
        userSpan.textContent = user.email.split('@')[0];
    }
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
    window.location.href = 'index.html';
}

// ========== PREDICTION LOGIC ==========

async function handlePrediction(e) {
    e.preventDefault();
    
    const carData = {
        brand: document.getElementById('brand').value.trim(),
        model: document.getElementById('model').value.trim(),
        year: parseInt(document.getElementById('year').value),
        engine_size: parseFloat(document.getElementById('engine_size').value),
        fuel_type: document.getElementById('fuel_type').value,
        transmission: document.getElementById('transmission').value,
        mileage: parseFloat(document.getElementById('mileage').value),
        condition: document.getElementById('condition').value
    };
    
    if (!validateCarData(carData)) {
        return;
    }
    
    showLoading(true);
    hideResult();
    hideError();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayResult(result.predicted_price, carData);
            saveToHistory(carData, result.predicted_price);
            loadPredictionHistory();
            updateStats();
        } else {
            showError(result.error || 'Prediction failed');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Cannot connect to server. Make sure the backend is running on port 5000');
    } finally {
        showLoading(false);
    }
}

function validateCarData(data) {
    if (!data.brand || data.brand === '') {
        showError('Please enter a car brand (e.g., Tesla, BMW, Ferrari)');
        return false;
    }
    
    if (!data.model || data.model === '') {
        showError('Please enter the car model');
        return false;
    }
    
    if (isNaN(data.year) || data.year < 1980 || data.year > 2026) {
        showError('Please enter a valid year (1980-2026)');
        return false;
    }
    
    if (isNaN(data.engine_size) || data.engine_size <= 0) {
        showError('Please enter a valid engine size');
        return false;
    }
    
    if (isNaN(data.mileage) || data.mileage < 0) {
        showError('Please enter a valid mileage');
        return false;
    }
    
    return true;
}

function displayResult(price, carData) {
    const resultDiv = document.getElementById('result');
    const priceSpan = document.getElementById('predictedPrice');
    const messageSpan = document.getElementById('predictionMessage');
    const confidenceSpan = document.getElementById('confidence');
    
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
    
    priceSpan.textContent = formattedPrice;
    messageSpan.textContent = `Estimated price for ${carData.brand} ${carData.model}`;
    
    // Set confidence level
    if (price > 100000) {
        confidenceSpan.innerHTML = 'High (Luxury/Supercar Segment)';
    } else if (price > 50000) {
        confidenceSpan.innerHTML = 'High (Premium Segment)';
    } else if (price > 20000) {
        confidenceSpan.innerHTML = 'High (Standard Segment)';
    } else {
        confidenceSpan.innerHTML = 'Medium (Economy Segment)';
    }
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveToHistory(carData, price) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
    
    const prediction = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        price: price,
        fullName: `${carData.brand} ${carData.model} (${carData.year})`
    };
    
    history.unshift(prediction);
    
    if (history.length > 15) {
        history.pop();
    }
    
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

function loadPredictionHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
    const historyDiv = document.getElementById('historyList');
    
    if (!historyDiv) return;
    
    if (history.length === 0) {
        historyDiv.innerHTML = `
            <p style="text-align: center; color: var(--gray);">
                <i class="fas fa-info-circle"></i> No predictions yet. Try predicting a car!
            </p>
        `;
        return;
    }
    
    historyDiv.innerHTML = history.map(item => `
        <div class="history-item" style="margin-bottom: 15px; padding: 15px; background: var(--glass); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div>
                <strong><i class="fas fa-car"></i> ${item.brand} ${item.model}</strong>
                <br>
                <small style="color: var(--gray);">
                    <i class="fas fa-calendar"></i> ${item.year} | 
                    <i class="fas fa-clock"></i> ${new Date(item.timestamp).toLocaleString()}
                </small>
            </div>
            <div style="text-align: right;">
                <strong style="color: var(--success); font-size: 20px;">
                    $${item.price.toLocaleString()}
                </strong>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
    const countSpan = document.getElementById('predictionsCount');
    const avgSpan = document.getElementById('avgPrice');
    
    if (countSpan) {
        countSpan.textContent = history.length;
    }
    
    if (avgSpan && history.length > 0) {
        const avg = history.reduce((sum, item) => sum + item.price, 0) / history.length;
        avgSpan.textContent = '$' + Math.round(avg).toLocaleString();
    } else if (avgSpan) {
        avgSpan.textContent = '$0';
    }
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all prediction history?')) {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
        loadPredictionHistory();
        updateStats();
        showAlert('History cleared successfully!', 'success');
    }
}

// ========== UI HELPER FUNCTIONS ==========

function showLoading(show) {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.style.display = show ? 'block' : 'none';
    }
}

function hideResult() {
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    const errorMessageSpan = document.getElementById('errorMessage');
    
    if (errorDiv && errorMessageSpan) {
        errorMessageSpan.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

function hideError() {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i> ${message}`;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
}

// Make functions global
window.logout = logout;
window.clearHistory = clearHistory;
window.fillSuggestion = fillSuggestion;