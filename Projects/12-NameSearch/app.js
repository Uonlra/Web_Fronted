const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const results = document.querySelector("#results");
const statusText = document.querySelector("#status-text");
const submitButton = form.querySelector("button");

const MAX_RESULTS = 12;
const CANDIDATE_LIMIT = 100;

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "搜索中..." : "搜索";
}

function normalizeSearchText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isWordBoundary(text, index) {
  if (index === 0) {
    return true;
  }

  return ["-", "_", ".", " "].includes(text[index - 1]);
}

function getAcronym(text) {
  return text
    .split(/[-_.\s]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("");
}

function getEditDistance(firstText, secondText) {
  if (Math.abs(firstText.length - secondText.length) > 3) {
    return Number.POSITIVE_INFINITY;
  }

  const previousRow = Array.from(
    { length: secondText.length + 1 },
    (_, index) => index,
  );

  for (let firstIndex = 1; firstIndex <= firstText.length; firstIndex += 1) {
    const currentRow = [firstIndex];

    for (
      let secondIndex = 1;
      secondIndex <= secondText.length;
      secondIndex += 1
    ) {
      const cost =
        firstText[firstIndex - 1] === secondText[secondIndex - 1] ? 0 : 1;

      currentRow[secondIndex] = Math.min(
        previousRow[secondIndex] + 1,
        currentRow[secondIndex - 1] + 1,
        previousRow[secondIndex - 1] + cost,
      );
    }

    previousRow.splice(0, previousRow.length, ...currentRow);
  }

  return previousRow[secondText.length];
}

function getSequentialScore(text, query) {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  let score = 0;
  let queryIndex = 0;
  let previousMatchIndex = -1;

  for (let textIndex = 0; textIndex < normalizedText.length; textIndex += 1) {
    if (normalizedText[textIndex] !== normalizedQuery[queryIndex]) {
      continue;
    }

    const isConsecutive = previousMatchIndex === textIndex - 1;
    const gap =
      previousMatchIndex === -1 ? textIndex : textIndex - previousMatchIndex - 1;

    score += isConsecutive ? 32 : 12;
    score += isWordBoundary(normalizedText, textIndex) ? 18 : 0;
    score -= gap * 3;

    previousMatchIndex = textIndex;
    queryIndex += 1;

    if (queryIndex === normalizedQuery.length) {
      return score - normalizedText.length;
    }
  }

  return 0;
}

function getFuzzyScore(text, query) {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const compactText = normalizeSearchText(text);
  const compactQuery = normalizeSearchText(query);

  if (!compactQuery) {
    return 0;
  }

  const scores = [];

  if (lowerText === lowerQuery || compactText === compactQuery) {
    scores.push(1000);
  }

  if (lowerText.startsWith(lowerQuery) || compactText.startsWith(compactQuery)) {
    scores.push(850 - Math.abs(compactText.length - compactQuery.length) * 4);
  }

  const includesIndex = compactText.indexOf(compactQuery);

  if (includesIndex !== -1) {
    scores.push(
      700 - includesIndex * 12 - (compactText.length - compactQuery.length),
    );
  }

  const acronym = getAcronym(lowerText);

  if (acronym.startsWith(compactQuery)) {
    scores.push(660 - acronym.length * 8);
  }

  const sequentialScore = getSequentialScore(text, query);

  if (sequentialScore > 0) {
    scores.push(420 + sequentialScore);
  }

  if (compactQuery.length >= 4) {
    const maxDistance = Math.max(1, Math.floor(compactQuery.length * 0.3));
    const editDistance = getEditDistance(compactText, compactQuery);

    if (editDistance <= maxDistance) {
      scores.push(
        520 -
          editDistance * 90 -
          Math.abs(compactText.length - compactQuery.length) * 6,
      );
    }
  }

  return Math.max(0, ...scores);
}

function getFuzzyUsers(users, query) {
  return users
    .map((user) => ({
      ...user,
      fuzzyScore: getFuzzyScore(user.login, query),
    }))
    .filter((user) => user.fuzzyScore > 0)
    .sort((firstUser, secondUser) => {
      if (secondUser.fuzzyScore !== firstUser.fuzzyScore) {
        return secondUser.fuzzyScore - firstUser.fuzzyScore;
      }

      return firstUser.login.localeCompare(secondUser.login);
    })
    .slice(0, MAX_RESULTS);
}

function renderUsers(users) {
  results.innerHTML = "";

  if (users.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "没有找到匹配的 GitHub 用户。";
    results.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  users.forEach((user) => {
    const card = document.createElement("a");
    card.className = "user-card";
    card.href = user.html_url;
    card.target = "_blank";
    card.rel = "noreferrer";

    const avatar = document.createElement("img");
    avatar.src = user.avatar_url;
    avatar.alt = `${user.login} 的头像`;

    const details = document.createElement("div");

    const name = document.createElement("p");
    name.className = "user-name";
    name.textContent = user.login;

    const url = document.createElement("p");
    url.className = "user-url";
    url.textContent = user.html_url;

    details.append(name, url);
    card.append(avatar, details);
    fragment.append(card);
  });

  results.append(fragment);
}

function renderError(message) {
  results.innerHTML = "";

  const error = document.createElement("p");
  error.className = "error-state";
  error.textContent = message;

  results.append(error);
}

async function searchUsers(query) {
  const url = `https://api.github.com/search/users?q=${encodeURIComponent(
    query,
  )}&per_page=${CANDIDATE_LIMIT}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`GitHub API 请求失败：${response.status}`);
  }

  return response.json();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();

  if (!query) {
    statusText.textContent = "请输入关键词再搜索。";
    return;
  }

  setLoading(true);
  statusText.textContent = `正在搜索 "${query}"...`;
  results.innerHTML = "";

  try {
    const data = await searchUsers(query);
    const fuzzyUsers = getFuzzyUsers(data.items, query);

    renderUsers(fuzzyUsers);
    statusText.textContent = `GitHub 返回 ${data.total_count.toLocaleString()} 个候选，模糊匹配后显示 ${fuzzyUsers.length} 个。`;
  } catch (error) {
    renderError(error.message);
    statusText.textContent = "搜索失败，请稍后再试。";
  } finally {
    setLoading(false);
  }
});
