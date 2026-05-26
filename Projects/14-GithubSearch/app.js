const LANGUAGE_URL =
  "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json";
const SEARCH_URL = "https://api.github.com/search/repositories";
const PER_PAGE = 30;
const MAX_GITHUB_SEARCH_RESULTS = 1000;
const REQUEST_TIMEOUT = 10000;
const FALLBACK_LANGUAGES = [
  { title: "JavaScript", value: "JavaScript" },
  { title: "TypeScript", value: "TypeScript" },
  { title: "Python", value: "Python" },
  { title: "Java", value: "Java" },
  { title: "Go", value: "Go" },
  { title: "Rust", value: "Rust" },
  { title: "C++", value: "C++" },
  { title: "C#", value: "C#" },
  { title: "PHP", value: "PHP" },
  { title: "Ruby", value: "Ruby" },
  { title: "Swift", value: "Swift" },
  { title: "Kotlin", value: "Kotlin" },
];

const languageSelect = document.querySelector("#language-select");
const descriptionInput = document.querySelector("#description-input");
const starsSelect = document.querySelector("#stars-select");
const sortSelect = document.querySelector("#sort-select");
const statusPanel = document.querySelector("#status-panel");
const repoCard = document.querySelector("#repo-card");
const actionButton = document.querySelector("#action-button");
const repoName = document.querySelector("#repo-name");
const repoDescription = document.querySelector("#repo-description");
const repoLanguage = document.querySelector("#repo-language span:last-child");
const repoStars = document.querySelector("#repo-stars");
const repoForks = document.querySelector("#repo-forks");
const repoIssues = document.querySelector("#repo-issues");

let selectedLanguage = "";
let isLoading = false;

const numberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

initialize();

languageSelect.addEventListener("change", () => {
  selectedLanguage = languageSelect.value;

  if (!selectedLanguage) {
    renderEmptyState();
    return;
  }

  fetchRandomRepository();
});

[descriptionInput, starsSelect, sortSelect].forEach((control) => {
  control.addEventListener("change", () => {
    if (!selectedLanguage) {
      return;
    }

    fetchRandomRepository();
  });
});

descriptionInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || !selectedLanguage) {
    return;
  }

  fetchRandomRepository();
});

actionButton.addEventListener("click", () => {
  if (!selectedLanguage || isLoading) {
    return;
  }

  fetchRandomRepository();
});

async function initialize() {
  try {
    const response = await fetch(LANGUAGE_URL);

    if (!response.ok) {
      throw new Error("Could not load languages");
    }

    const languages = await response.json();
    populateLanguageOptions(languages);
  } catch (error) {
    populateLanguageOptions(FALLBACK_LANGUAGES);
    renderEmptyState();
  }
}

function populateLanguageOptions(languages) {
  const fragment = document.createDocumentFragment();

  languages.forEach((language) => {
    const option = document.createElement("option");
    option.value = language.value || language.title;
    option.textContent = language.title;
    fragment.append(option);
  });

  languageSelect.append(fragment);
}

async function fetchRandomRepository() {
  renderLoadingState();

  try {
    const filters = getSearchFilters();
    const repository = await getRandomRepository(filters);
    renderRepository(repository);
  } catch (error) {
    renderErrorState("Error fetching repositories");
  }
}

async function getRandomRepository(filters) {
  const firstPageUrl = buildSearchUrl(filters, 1);
  const firstPageResponse = await fetchWithTimeout(firstPageUrl);

  if (!firstPageResponse.ok) {
    throw new Error("GitHub request failed");
  }

  const firstPageData = await firstPageResponse.json();

  if (!firstPageData.total_count || firstPageData.items.length === 0) {
    throw new Error("No repositories found");
  }

  const cappedTotal = Math.min(firstPageData.total_count, MAX_GITHUB_SEARCH_RESULTS);
  const totalPages = Math.ceil(cappedTotal / PER_PAGE);
  const randomPage = getRandomInteger(1, totalPages);

  if (randomPage === 1) {
    return pickRandomItem(firstPageData.items);
  }

  const pageResponse = await fetchWithTimeout(buildSearchUrl(filters, randomPage));

  if (!pageResponse.ok) {
    throw new Error("GitHub request failed");
  }

  const pageData = await pageResponse.json();

  if (!pageData.items.length) {
    return pickRandomItem(firstPageData.items);
  }

  return pickRandomItem(pageData.items);
}

function getSearchFilters() {
  return {
    description: descriptionInput.value.trim(),
    language: selectedLanguage,
    minimumStars: starsSelect.value,
    sort: sortSelect.value,
  };
}

function buildSearchUrl(filters, page) {
  const queryParts = [`language:${filters.language}`];

  if (filters.description) {
    queryParts.push(filters.description, "in:description");
  }

  if (filters.minimumStars) {
    queryParts.push(`stars:>=${filters.minimumStars}`);
  }

  const params = new URLSearchParams({
    per_page: PER_PAGE,
    page,
  });

  params.set("q", queryParts.join(" "));

  if (filters.sort === "stars") {
    params.set("sort", "stars");
    params.set("order", "desc");
  }

  return `${SEARCH_URL}?${params.toString()}`;
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

function renderEmptyState() {
  isLoading = false;
  setControlsDisabled(false);
  repoCard.hidden = true;
  actionButton.hidden = true;
  actionButton.classList.remove("error-action");
  statusPanel.hidden = false;
  statusPanel.className = "status-panel empty";
  statusPanel.innerHTML = "<p>Please select a language</p>";
}

function renderLoadingState() {
  isLoading = true;
  setControlsDisabled(true);
  repoCard.hidden = true;
  actionButton.hidden = true;
  actionButton.classList.remove("error-action");
  statusPanel.hidden = false;
  statusPanel.className = "status-panel loading";
  statusPanel.innerHTML = `
    <div class="loading-indicator">
      <p>Loading, please wait...</p>
      <span aria-hidden="true"></span>
    </div>
  `;
}

function renderErrorState(message) {
  isLoading = false;
  setControlsDisabled(!languageSelect.options.length);
  repoCard.hidden = true;
  statusPanel.hidden = false;
  statusPanel.className = "status-panel error";
  statusPanel.innerHTML = `<p>${message}</p>`;

  if (selectedLanguage) {
    actionButton.hidden = false;
    actionButton.disabled = false;
    actionButton.textContent = "Click to retry";
    actionButton.classList.add("error-action");
  }
}

function renderRepository(repository) {
  isLoading = false;
  setControlsDisabled(false);
  statusPanel.hidden = true;
  statusPanel.className = "status-panel";
  repoCard.hidden = false;
  actionButton.hidden = false;
  actionButton.disabled = false;
  actionButton.textContent = "Refresh";
  actionButton.classList.remove("error-action");

  repoName.href = repository.html_url;
  repoName.textContent = repository.name;
  repoDescription.textContent =
    repository.description || "No description provided for this repository.";
  repoLanguage.textContent = repository.language || selectedLanguage;
  repoStars.textContent = numberFormatter.format(repository.stargazers_count);
  repoForks.textContent = numberFormatter.format(repository.forks_count);
  repoIssues.textContent = numberFormatter.format(repository.open_issues_count);
}

function setControlsDisabled(disabled) {
  languageSelect.disabled = disabled;
  descriptionInput.disabled = disabled;
  starsSelect.disabled = disabled;
  sortSelect.disabled = disabled;
}

function pickRandomItem(items) {
  return items[getRandomInteger(0, items.length - 1)];
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
