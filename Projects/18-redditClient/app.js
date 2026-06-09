const STORAGE_KEY = "reddit-lanes:v1";
const DEFAULT_SUBREDDITS = ["learnprogramming", "javascript"];
const POST_LIMIT = 12;
const USE_MOCK_DATA = new URLSearchParams(window.location.search).has("mock");

const board = document.querySelector("#board");
const modalBackdrop = document.querySelector("#modal-backdrop");
const addLaneButton = document.querySelector("#add-lane-button");
const closeModalButton = document.querySelector("#close-modal-button");
const addSubredditForm = document.querySelector("#add-subreddit-form");
const subredditInput = document.querySelector("#subreddit-input");
const formError = document.querySelector("#form-error");

let lanes = loadSavedLanes();

function loadSavedLanes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.every((item) => typeof item === "string")) {
      const restored = dedupeSubreddits(saved.map(normalizeSubreddit).filter(isValidSubredditName));
      return restored.length ? restored : DEFAULT_SUBREDDITS;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return DEFAULT_SUBREDDITS;
}

function saveLanes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lanes));
}

function normalizeSubreddit(value) {
  return value
    .trim()
    .replace(/^\/?r\//i, "")
    .replace(/\/+$/g, "");
}

function isValidSubredditName(value) {
  return /^[A-Za-z0-9_]{2,21}$/.test(value);
}

function dedupeSubreddits(values) {
  const seen = new Set();

  return values.filter((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatVotes(score) {
  const value = Number(score) || 0;

  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}m`;
  }

  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}k`;
  }

  return String(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getLaneId(subreddit) {
  return `lane-${subreddit.toLowerCase()}`;
}

function renderBoard() {
  board.innerHTML = lanes.map(renderLaneShell).join("") + renderAddLanePanel();

  for (const subreddit of lanes) {
    fetchLane(subreddit);
  }
}

function renderLaneShell(subreddit) {
  const safeSubreddit = escapeHtml(subreddit);

  return `
    <article class="lane" id="${getLaneId(subreddit)}" data-subreddit="${safeSubreddit}">
      <header class="lane-header">
        <h2 class="lane-title">
          <span>/r/${safeSubreddit}</span>
          <small class="lane-subtitle">Loading posts</small>
        </h2>
        <div class="lane-menu-wrap">
          <button class="icon-button menu-button" type="button" aria-label="Open /r/${safeSubreddit} menu" data-action="toggle-menu">
            <span aria-hidden="true">&#8942;</span>
          </button>
          <div class="lane-menu" hidden>
            <button type="button" data-action="refresh">Refresh</button>
            <button class="danger" type="button" data-action="delete">Delete</button>
          </div>
        </div>
      </header>
      <div class="posts">${renderLoadingState()}</div>
    </article>
  `;
}

function renderAddLanePanel() {
  return `
    <section class="add-lane-panel" aria-label="Add a subreddit lane">
      <button class="icon-button" type="button" aria-label="Add subreddit" data-action="open-add-modal">
        <span aria-hidden="true">+</span>
      </button>
    </section>
  `;
}

function renderLoadingState() {
  return `
    <div class="state" aria-live="polite">
      <div class="state-content">
        <div class="spinner" aria-hidden="true"></div>
        <p class="state-title">Fetching posts</p>
        <p class="state-copy">Loading the latest Reddit feed.</p>
      </div>
    </div>
  `;
}

function renderErrorState(subreddit, message) {
  return `
    <div class="state" aria-live="polite">
      <div class="state-content">
        <p class="state-title">Could not load /r/${escapeHtml(subreddit)}</p>
        <p class="state-copy">${escapeHtml(message)}</p>
        <button class="small-button" type="button" data-action="retry">Try again</button>
      </div>
    </div>
  `;
}

function renderEmptyState(subreddit) {
  return `
    <div class="state" aria-live="polite">
      <div class="state-content">
        <p class="state-title">No posts found</p>
        <p class="state-copy">/r/${escapeHtml(subreddit)} returned an empty feed.</p>
        <button class="small-button" type="button" data-action="retry">Refresh</button>
      </div>
    </div>
  `;
}

function renderPosts(posts) {
  return posts
    .map((post) => {
      const redditUrl = `https://www.reddit.com${post.permalink}`;
      const author = post.author ? `u/${post.author}` : "unknown author";
      const comments = `${post.num_comments || 0} comments`;

      return `
        <a class="post-link" href="${escapeHtml(redditUrl)}" target="_blank" rel="noreferrer">
          <span class="vote-block" aria-label="${escapeHtml(formatVotes(post.score))} votes">
            <span class="vote-arrow" aria-hidden="true">^</span>
            <span class="vote-count">${escapeHtml(formatVotes(post.score))}</span>
          </span>
          <span>
            <span class="post-title">${escapeHtml(post.title)}</span>
            <span class="post-meta">${escapeHtml(author)} / ${escapeHtml(comments)}</span>
          </span>
        </a>
      `;
    })
    .join("");
}

async function fetchLane(subreddit) {
  const lane = document.querySelector(`#${CSS.escape(getLaneId(subreddit))}`);
  if (!lane) return;

  const postsElement = lane.querySelector(".posts");
  const subtitle = lane.querySelector(".lane-subtitle");
  postsElement.innerHTML = renderLoadingState();
  subtitle.textContent = "Loading posts";

  try {
    const posts = await getSubredditPosts(subreddit);

    if (!posts.length) {
      postsElement.innerHTML = renderEmptyState(subreddit);
      subtitle.textContent = "No posts";
      return;
    }

    postsElement.innerHTML = renderPosts(posts);
    subtitle.textContent = `${posts.length} posts`;
  } catch (error) {
    const message =
      error instanceof TypeError
        ? "Network or browser access failed while reaching Reddit."
        : error.message || "Something went wrong while fetching posts.";

    postsElement.innerHTML = renderErrorState(subreddit, message);
    subtitle.textContent = "Error";
  }
}

async function getSubredditPosts(subreddit) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => window.setTimeout(resolve, 320));
    return createMockPosts(subreddit);
  }

  const url = `https://www.reddit.com/r/${encodeURIComponent(subreddit)}.json?limit=${POST_LIMIT}&raw_json=1`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("That subreddit does not exist.");
    }

    if (response.status === 429) {
      throw new Error("Reddit rate-limited this request. Try again in a minute.");
    }

    throw new Error(`Reddit returned an API error (${response.status}).`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Reddit did not return JSON for this request.");
  }

  const data = await response.json();
  return data?.data?.children?.map((item) => item.data).filter(Boolean) || [];
}

function createMockPosts(subreddit) {
  return [
    {
      title: `Top discussion from /r/${subreddit}`,
      author: "sample_author",
      score: 431,
      num_comments: 18,
      permalink: `/r/${subreddit}/comments/mock1/top_discussion/`,
    },
    {
      title: "Another useful post with a title long enough to wrap cleanly",
      author: "another_user",
      score: 3120,
      num_comments: 7,
      permalink: `/r/${subreddit}/comments/mock2/another_post/`,
    },
    {
      title: "Community question with practical examples",
      author: "curious_dev",
      score: 98,
      num_comments: 31,
      permalink: `/r/${subreddit}/comments/mock3/community_question/`,
    },
  ];
}

function openModal() {
  modalBackdrop.hidden = false;
  formError.textContent = "";
  subredditInput.value = "";
  setTimeout(() => subredditInput.focus(), 0);
}

function closeModal() {
  modalBackdrop.hidden = true;
}

function addSubreddit(value) {
  const subreddit = normalizeSubreddit(value);
  const exists = lanes.some((lane) => lane.toLowerCase() === subreddit.toLowerCase());

  if (!subreddit) {
    formError.textContent = "Enter a subreddit name.";
    return;
  }

  if (!isValidSubredditName(subreddit)) {
    formError.textContent = "Use 2-21 letters, numbers, or underscores.";
    return;
  }

  if (exists) {
    formError.textContent = `/${subreddit} is already on the board.`;
    return;
  }

  lanes = [...lanes, subreddit];
  saveLanes();
  closeModal();
  renderBoard();

  const lane = document.querySelector(`#${CSS.escape(getLaneId(subreddit))}`);
  lane?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
}

function deleteSubreddit(subreddit) {
  const lane = document.querySelector(`#${CSS.escape(getLaneId(subreddit))}`);

  if (!lane) return;

  lane.classList.add("removing");

  window.setTimeout(() => {
    lanes = lanes.filter((item) => item.toLowerCase() !== subreddit.toLowerCase());
    saveLanes();
    renderBoard();
  }, 160);
}

function closeAllMenus(exceptMenu = null) {
  document.querySelectorAll(".lane-menu").forEach((menu) => {
    if (menu !== exceptMenu) {
      menu.hidden = true;
    }
  });
}

board.addEventListener("click", (event) => {
  event.stopPropagation();

  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) {
    closeAllMenus();
    return;
  }

  const action = actionElement.dataset.action;
  const lane = actionElement.closest(".lane");
  const subreddit = lane?.dataset.subreddit;

  if (action === "open-add-modal") {
    openModal();
    return;
  }

  if (!lane || !subreddit) return;

  if (action === "toggle-menu") {
    const menu = lane.querySelector(".lane-menu");
    const willOpen = menu.hidden;
    closeAllMenus(menu);
    menu.hidden = !willOpen;
    return;
  }

  closeAllMenus();

  if (action === "refresh" || action === "retry") {
    fetchLane(subreddit);
  }

  if (action === "delete") {
    deleteSubreddit(subreddit);
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".lane-menu-wrap")) {
    closeAllMenus();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllMenus();
    closeModal();
  }
});

addLaneButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});

addSubredditForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addSubreddit(subredditInput.value);
});

renderBoard();
