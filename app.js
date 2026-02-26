import API_KEY from './config.js';

const DOM = {
    cityInput: document.getElementById('city-input'),
    locateBtn: document.getElementById('locate-btn'),
    weatherContent: document.getElementById('weather-content'),
    placeholder: document.getElementById('placeholder'),
    loader: document.getElementById('loader'),
    welcomeMsg: document.getElementById('welcome-msg'),
    errorMsg: document.getElementById('error-msg'),

    // UI Elements to update
    cityName: document.getElementById('city-name'),
    dateTime: document.getElementById('date-time'),
    temp: document.getElementById('temperature'),
    weatherDesc: document.getElementById('weather-desc'),
    tempMin: document.getElementById('temp-min'),
    tempMax: document.getElementById('temp-max'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    feelsLike: document.getElementById('feels-like'),
    iconContainer: document.getElementById('weather-icon-container'),
    forecastContainer: document.getElementById('forecast-container'),
    bgOverlay: document.getElementById('bg-overlay'),

    // Units
    unitC: document.getElementById('unit-c'),
    unitF: document.getElementById('unit-f'),
    searchHistoryContainer: document.getElementById('search-history')
};

let currentCity = '';
let currentUnit = 'metric';
let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];

// --- Event Listeners ---
window.addEventListener('DOMContentLoaded', () => {
    renderHistory();
    // Auto-load last searched city or default
    if (history.length > 0) {
        getWeather(history[0]);
    } else {
        // Try geolocation if no history
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    getWeatherByCoords(latitude, longitude);
                }
            );
        }
    }
});
DOM.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && DOM.cityInput.value.trim()) {
        getWeather(DOM.cityInput.value.trim());
    }
});

DOM.locateBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        showLoader();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoords(latitude, longitude);
            },
            () => {
                hideLoader();
                alert("Geolocation failed. Please search manually.");
            }
        );
    }
});

DOM.unitC.addEventListener('click', () => switchUnit('metric'));
DOM.unitF.addEventListener('click', () => switchUnit('imperial'));

// --- Core Logic ---

async function getWeather(city) {
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        alert("Please provide a valid API key in config.js");
        return;
    }

    showLoader();
    currentCity = city;

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${API_KEY}`
        );

        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        updateMainUI(data);
        await getForecast(city);

        addToHistory(city);

        DOM.placeholder.classList.add('hidden');
        DOM.weatherContent.classList.remove('hidden');
    } catch (err) {
        showError();
    } finally {
        hideLoader();
    }
}

async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`
        );
        const data = await response.json();
        updateMainUI(data);
        getForecastByCoords(lat, lon);

        DOM.placeholder.classList.add('hidden');
        DOM.weatherContent.classList.remove('hidden');
    } catch (err) {
        showError();
    } finally {
        hideLoader();
    }
}

async function getForecast(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${currentUnit}&appid=${API_KEY}`
    );
    const data = await response.json();
    renderForecast(data);
}

async function getForecastByCoords(lat, lon) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`
    );
    const data = await response.json();
    renderForecast(data);
}

// --- UI Updates ---

function updateMainUI(data) {
    const { name, sys, main, weather, wind, dt } = data;
    const weatherMain = weather[0].main;

    DOM.cityName.innerText = `${name}, ${sys.country}`;
    DOM.dateTime.innerText = formatDate(dt);
    DOM.temp.innerText = `${Math.round(main.temp)}º`;
    DOM.weatherDesc.innerText = weather[0].description;
    DOM.tempMin.innerText = `${Math.round(main.temp_min)}º`;
    DOM.tempMax.innerText = `${Math.round(main.temp_max)}º`;
    DOM.humidity.innerText = `${main.humidity}%`;
    DOM.windSpeed.innerText = `${Math.round(wind.speed)} ${currentUnit === 'metric' ? 'km/h' : 'mph'}`;
    DOM.feelsLike.innerText = `${Math.round(main.feels_like)}º`;

    updateWeatherIcon(weatherMain);
    updateBackground(weatherMain);
}

function renderForecast(data) {
    DOM.forecastContainer.innerHTML = '';

    // Filter to get one forecast per day (OpenWeather returns every 3h)
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const forecastHTML = `
            <div class="forecast-item glass p-4 rounded-3xl border border-white/10 flex flex-col items-center text-center">
                <span class="text-gray-400 font-medium">${dayName}</span>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="icon" class="w-12 h-12 my-2">
                <span class="text-xl font-bold">${Math.round(day.main.temp)}º</span>
                <span class="text-xs text-black mt-1 capitalize">${day.weather[0].main}</span>
            </div>
        `;
        DOM.forecastContainer.insertAdjacentHTML('beforeend', forecastHTML);
    });
}

// --- Persistence ---

function addToHistory(city) {
    const normalizedCity = city.trim();
    if (!normalizedCity) return;

    // Remove if already exists to move to top
    history = history.filter(item => item.toLowerCase() !== normalizedCity.toLowerCase());
    history.unshift(normalizedCity);

    // Keep only last 5
    if (history.length > 5) history.pop();

    localStorage.setItem('weatherHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        DOM.searchHistoryContainer.classList.add('hidden');
        return;
    }

    DOM.searchHistoryContainer.classList.remove('hidden');
    DOM.searchHistoryContainer.innerHTML = '';

    history.forEach(city => {
        const chip = document.createElement('button');
        chip.className = 'px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs font-medium transition-all';
        chip.innerText = city;
        chip.onclick = () => getWeather(city);
        DOM.searchHistoryContainer.appendChild(chip);
    });
}

function updateWeatherIcon(condition) {
    let iconClass = 'fa-cloud-sun';
    const c = condition.toLowerCase();

    if (c.includes('clear')) iconClass = 'fa-sun text-yellow-400';
    else if (c.includes('cloud')) iconClass = 'fa-cloud text-gray-400';
    else if (c.includes('rain')) iconClass = 'fa-cloud-showers-heavy text-blue-400';
    else if (c.includes('thunder')) iconClass = 'fa-bolt text-yellow-300';
    else if (c.includes('snow')) iconClass = 'fa-snowflake text-white';

    DOM.iconContainer.innerHTML = `<i class="fa-solid ${iconClass} text-8xl"></i>`;
}

function updateBackground(condition) {
    const c = condition.toLowerCase();
    let bgClasses = 'from-slate-900 to-slate-800';

    if (c.includes('clear')) bgClasses = 'from-blue-400 to-orange-400';
    else if (c.includes('cloud')) bgClasses = 'from-gray-600 to-slate-800';
    else if (c.includes('rain')) bgClasses = 'from-blue-700 to-slate-900';
    else if (c.includes('snow')) bgClasses = 'from-blue-100 to-slate-400';

    DOM.bgOverlay.className = `fixed inset-0 bg-gradient-to-br ${bgClasses} -z-10 transition-all duration-1000`;
}

function switchUnit(unit) {
    if (currentUnit === unit) return;
    currentUnit = unit;

    // Update active UI unit buttons
    if (unit === 'metric') {
        DOM.unitC.classList.replace('text-gray-500', 'text-white');
        DOM.unitF.classList.replace('text-white', 'text-gray-500');
    } else {
        DOM.unitF.classList.replace('text-gray-500', 'text-white');
        DOM.unitC.classList.replace('text-white', 'text-gray-500');
    }

    if (currentCity) getWeather(currentCity);
}

// --- Helpers ---

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
}

function showLoader() {
    DOM.loader.classList.remove('hidden');
    DOM.welcomeMsg.classList.add('hidden');
    DOM.errorMsg.classList.add('hidden');
}

function hideLoader() {
    DOM.loader.classList.add('hidden');
}

function showError() {
    DOM.placeholder.classList.remove('hidden');
    DOM.weatherContent.classList.add('hidden');
    DOM.welcomeMsg.classList.add('hidden');
    DOM.errorMsg.classList.remove('hidden');
}
