const THEME_STORAGE_KEY = 'theme';

function updateThemeIcons(theme) {
  const sunIcon = document.getElementById('sun_icon');
  const moonIcon = document.getElementById('moon_icon');

  if (!sunIcon || !moonIcon) {
    return;
  }

  const isDark = theme === 'dark';
  sunIcon.style.display = isDark ? 'block' : 'none';
  moonIcon.style.display = isDark ? 'none' : 'block';
}

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  updateThemeIcons(theme);
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme') || 'light';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  const toggleButton = document.querySelector('.theme-toggle');

  applyTheme(savedTheme);

  if (toggleButton) {
    toggleButton.addEventListener('click', toggleTheme);
  }
});