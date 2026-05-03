import './styles.css';

const API_KEY_STORAGE = 'visual-crossing-api-key';
const LOCATION_STORAGE = 'weather-location';
const DEFAULT_LOCATION = 'Los Angeles, CA, US';

const state = {
  apiKey: localStorage.getItem(API_KEY_STORAGE) || import.meta.env.VITE_VISUAL_CROSSING_API_KEY || '',
  location: localStorage.getItem(LOCATION_STORAGE) || DEFAULT_LOCATION,
  activeRange: 'future',
  lastWeather: null,
  loading: false,
  error: '',
};

const weatherThemes = {
  rain: {
    match: ['rain', 'drizzle', 'shower'],
    className: 'theme-rain',
    icon: 'cloud-rain',
  },
  snow: {
    match: ['snow', 'sleet', 'ice'],
    className: 'theme-snow',
    icon: 'snowflake',
  },
  storm: {
    match: ['thunder', 'storm', 'lightning'],
    className: 'theme-storm',
    icon: 'zap',
  },
  fog: {
    match: ['fog', 'mist', 'haze', 'smoke'],
    className: 'theme-fog',
    icon: 'cloud-fog',
  },
  cloud: {
    match: ['cloud', 'overcast'],
    className: 'theme-cloud',
    icon: 'cloud',
  },
  clear: {
    match: ['clear', 'sunny'],
    className: 'theme-clear',
    icon: 'sun',
  },
};

const app = document.querySelector('#app');

function render() {
  const weather = state.lastWeather;
  const current = weather?.currentConditions;
  const currentTheme = getWeatherTheme(current?.conditions || weather?.days?.[0]?.conditions || '');
  const place = weather?.resolvedAddress || state.location;
  const range = weather ? getHourlyRanges(weather, current) : { previous: [], future: [] };
  const activeHours = state.activeRange === 'previous' ? range.previous : range.future;

  app.innerHTML = `
    <main class="app-shell ${currentTheme.className}">
      <section class="weather-panel" aria-live="polite">
        <header class="topbar">
          <div>
            <p class="eyebrow">Weather Outlook</p>
            <h1>${escapeHtml(place)}</h1>
          </div>
          <button class="icon-button" id="refreshButton" type="button" aria-label="Refresh weather" title="Refresh">
            ${icon('refresh-cw')}
          </button>
        </header>

        <form class="search-row" id="weatherForm">
          <label class="field">
            <span>Location</span>
            <input id="locationInput" name="location" value="${escapeAttribute(state.location)}" placeholder="City, address, or coordinates" autocomplete="address-level2" />
          </label>
          <button class="primary-button" type="submit">
            ${icon('search')}
            <span>Search</span>
          </button>
        </form>

        <div class="key-row">
          <label class="field compact">
            <span>Visual Crossing key</span>
            <input id="apiKeyInput" type="password" value="${escapeAttribute(state.apiKey)}" placeholder="API key" autocomplete="off" />
          </label>
          <button class="ghost-button" id="geoButton" type="button">
            ${icon('map-pin')}
            <span>Current location</span>
          </button>
        </div>

        ${state.error ? `<div class="status error">${escapeHtml(state.error)}</div>` : ''}
        ${state.loading ? loadingMarkup() : dashboardMarkup(weather, current, activeHours, range)}
      </section>
    </main>
  `;

  document.querySelector('#weatherForm').addEventListener('submit', handleSearch);
  document.querySelector('#refreshButton').addEventListener('click', () => loadWeather(state.location));
  document.querySelector('#geoButton').addEventListener('click', loadCurrentLocation);
  document.querySelector('#apiKeyInput').addEventListener('change', handleApiKeyChange);
  document.querySelectorAll('[data-range]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeRange = button.dataset.range;
      render();
    });
  });
}

function dashboardMarkup(weather, current, activeHours, range) {
  if (!weather) {
    return `
      <section class="empty-state">
        <div class="large-icon">${icon('cloud-sun')}</div>
        <h2>Live Weather</h2>
        <p>Enter a Visual Crossing key and search a location.</p>
      </section>
    `;
  }

  const condition = current?.conditions || weather.days?.[0]?.conditions || 'Weather';
  const theme = getWeatherTheme(condition);
  const rainChance = current?.precipprob ?? weather.days?.[0]?.precipprob ?? 0;
  const windSpeed = current?.windspeed ?? weather.days?.[0]?.windspeed ?? 0;
  const temp = current?.temp ?? weather.days?.[0]?.temp ?? 0;

  return `
    <section class="current-grid">
      <div class="current-weather">
        <div class="weather-symbol">${icon(theme.icon)}</div>
        <div>
          <p class="timestamp">${formatFullTime(current?.datetimeEpoch)}</p>
          <div class="temp">${formatTemperature(temp)}</div>
          <p class="condition">${escapeHtml(condition)}</p>
        </div>
      </div>
      <div class="metric-card">
        ${icon('wind')}
        <span>Wind</span>
        <strong>${formatNumber(windSpeed)} mph</strong>
      </div>
      <div class="metric-card">
        ${icon('umbrella')}
        <span>Rain</span>
        <strong>${Math.round(rainChance)}%</strong>
      </div>
      <div class="metric-card">
        ${icon('thermometer')}
        <span>Feels</span>
        <strong>${formatTemperature(current?.feelslike ?? temp)}</strong>
      </div>
    </section>

    <section class="hourly-section">
      <div class="section-head">
        <div>
          <p class="eyebrow">24 Hour Periods</p>
          <h2>${state.activeRange === 'previous' ? 'Previous Hours' : 'Future Hours'}</h2>
        </div>
        <div class="segmented" role="tablist" aria-label="Hourly range">
          <button type="button" data-range="previous" class="${state.activeRange === 'previous' ? 'active' : ''}">Previous</button>
          <button type="button" data-range="future" class="${state.activeRange === 'future' ? 'active' : ''}">Future</button>
        </div>
      </div>
      <div class="hour-strip">
        ${activeHours.map(hourCard).join('') || '<p class="status">Hourly weather is unavailable for this range.</p>'}
      </div>
      <div class="range-summary">
        <span>${range.previous.length} previous hours</span>
        <span>${range.future.length} future hours</span>
      </div>
    </section>
  `;
}

function loadingMarkup() {
  return `
    <section class="loading-state" aria-label="Loading weather">
      <div class="pulse-orbit">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>Loading weather</p>
    </section>
  `;
}

function hourCard(hour) {
  const theme = getWeatherTheme(hour.conditions);
  return `
    <article class="hour-card">
      <time>${formatHour(hour.datetimeEpoch)}</time>
      <div>${icon(theme.icon)}</div>
      <strong>${formatTemperature(hour.temp)}</strong>
      <span>${Math.round(hour.precipprob ?? 0)}% rain</span>
      <small>${formatNumber(hour.windspeed)} mph</small>
    </article>
  `;
}

async function handleSearch(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const location = String(formData.get('location') || '').trim();
  if (!location) {
    state.error = 'Enter a location.';
    render();
    return;
  }
  await loadWeather(location);
}

async function handleApiKeyChange(event) {
  state.apiKey = event.currentTarget.value.trim();
  localStorage.setItem(API_KEY_STORAGE, state.apiKey);
  state.error = '';
  render();
  if (state.apiKey && !state.lastWeather) {
    await loadCurrentLocation();
  }
}

async function loadCurrentLocation() {
  if (!navigator.geolocation) {
    state.error = 'Current location is unavailable in this browser.';
    render();
    return;
  }

  state.loading = true;
  state.error = '';
  render();

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const location = `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`;
      loadWeather(location);
    },
    () => {
      state.loading = false;
      state.error = 'Location permission was not granted.';
      render();
      if (state.apiKey) {
        loadWeather(state.location);
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
  );
}

async function loadWeather(location) {
  if (!state.apiKey) {
    state.location = location;
    localStorage.setItem(LOCATION_STORAGE, state.location);
    state.error = 'Add a Visual Crossing API key to load live weather.';
    state.loading = false;
    render();
    return;
  }

  state.loading = true;
  state.error = '';
  state.location = location;
  localStorage.setItem(LOCATION_STORAGE, state.location);
  render();

  try {
    const weather = await fetchWeather(location, state.apiKey);
    state.lastWeather = weather;
    state.error = '';
  } catch (error) {
    state.error = error.message || 'Weather data could not be loaded.';
  } finally {
    state.loading = false;
    render();
  }
}

async function fetchWeather(location, apiKey) {
  const today = new Date();
  const start = toDateString(addDays(today, -1));
  const end = toDateString(addDays(today, 1));
  const encodedLocation = encodeURIComponent(location);
  const params = new URLSearchParams({
    unitGroup: 'us',
    include: 'hours,current',
    key: apiKey,
    contentType: 'json',
  });
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLocation}/${start}/${end}?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('The Visual Crossing API key was rejected.');
    }
    if (response.status === 400) {
      throw new Error('That location could not be found.');
    }
    throw new Error('Visual Crossing did not return weather data.');
  }

  return response.json();
}

function getHourlyRanges(weather, current) {
  const hours = weather.days
    .flatMap((day) => day.hours.map((hour) => ({
      ...hour,
      datetimeEpoch: hour.datetimeEpoch || new Date(`${day.datetime}T${hour.datetime}`).getTime() / 1000,
    })))
    .sort((a, b) => a.datetimeEpoch - b.datetimeEpoch);
  const nowEpoch = current?.datetimeEpoch || Date.now() / 1000;
  const previous = hours.filter((hour) => hour.datetimeEpoch < nowEpoch).slice(-24);
  const future = hours.filter((hour) => hour.datetimeEpoch >= nowEpoch).slice(0, 24);
  return { previous, future };
}

function getWeatherTheme(condition = '') {
  const normalized = condition.toLowerCase();
  return Object.values(weatherThemes).find((theme) => theme.match.some((word) => normalized.includes(word))) || weatherThemes.clear;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

function formatTemperature(value) {
  return `${Math.round(Number(value) || 0)}°`;
}

function formatNumber(value) {
  return Math.round(Number(value) || 0);
}

function formatFullTime(epoch) {
  if (!epoch) return 'Current conditions';
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(epoch * 1000));
}

function formatHour(epoch) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
  }).format(new Date(epoch * 1000));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}

function icon(name) {
  const icons = {
    'cloud-sun': '<svg viewBox="0 0 24 24"><path d="M12 2v3M4.2 4.2l2.1 2.1M2 12h3M19 12h3M17.7 6.3l2.1-2.1"/><path d="M8.5 15.5a4.5 4.5 0 1 1 8.8-1.2"/><path d="M6 19h11a3 3 0 0 0 0-6 5 5 0 0 0-9.7 1.2A2.5 2.5 0 0 0 6 19Z"/></svg>',
    'cloud-rain': '<svg viewBox="0 0 24 24"><path d="M6 17.5h11a4 4 0 0 0 0-8 6 6 0 0 0-11.6 1.6A3.3 3.3 0 0 0 6 17.5Z"/><path d="M8 20l-1 2M13 20l-1 2M18 20l-1 2"/></svg>',
    'cloud-fog': '<svg viewBox="0 0 24 24"><path d="M6 15h11a4 4 0 0 0 0-8 6 6 0 0 0-11.6 1.6A3.3 3.3 0 0 0 6 15Z"/><path d="M5 19h14M7 22h10"/></svg>',
    cloud: '<svg viewBox="0 0 24 24"><path d="M6 18h11a4 4 0 0 0 0-8 6 6 0 0 0-11.6 1.6A3.3 3.3 0 0 0 6 18Z"/></svg>',
    refresh: '<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"/><path d="M3 21v-5h5"/><path d="M3 12A9 9 0 0 1 18.4 5.6L21 8"/><path d="M21 3v5h-5"/></svg>',
    'refresh-cw': '<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 1-9 9 9.7 9.7 0 0 1-6.4-2.6L3 16"/><path d="M3 21v-5h5"/><path d="M3 12a9 9 0 0 1 9-9 9.7 9.7 0 0 1 6.4 2.6L21 8"/><path d="M21 3v5h-5"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    'map-pin': '<svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
    snowflake: '<svg viewBox="0 0 24 24"><path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1 19.1 4.9"/><path d="m8 4 4 4 4-4M8 20l4-4 4 4"/></svg>',
    zap: '<svg viewBox="0 0 24 24"><path d="m13 2-9 13h8l-1 7 9-13h-8l1-7Z"/></svg>',
    wind: '<svg viewBox="0 0 24 24"><path d="M3 8h12a3 3 0 1 0-3-3"/><path d="M3 13h16a3 3 0 1 1-3 3"/><path d="M3 18h8"/></svg>',
    umbrella: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 16 0Z"/><path d="M12 12v6a3 3 0 0 0 6 0"/><path d="M12 2v3"/></svg>',
    thermometer: '<svg viewBox="0 0 24 24"><path d="M14 14.8V5a4 4 0 0 0-8 0v9.8a6 6 0 1 0 8 0Z"/><path d="M10 8v8"/></svg>',
  };
  return icons[name] || icons.sun;
}

render();
if (state.apiKey) {
  loadCurrentLocation();
} else {
  loadWeather(state.location);
}
