// ===== 主题切换 =====
const themeToggle = document.querySelector("[data-theme-toggle]");

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.textContent = "切换暗色";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "切换亮色";
  }
});

// ===== Todo 核心逻辑 =====
const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("[data-todo-list]");
const counterEl = document.querySelector("[data-counter]");
const emptyHint = document.querySelector("[data-empty-hint]");
const todoFooter = document.querySelector("[data-footer]");
const clearBtn = document.querySelector("[data-clear-completed]");
const filtersNav = document.querySelector("[data-filters]");

let currentFilter = "all";

// -- 工具函数：格式化时间 --
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hour}:${min}`;
}

// -- 持久化 --
function saveTodos() {
  const items = todoList.querySelectorAll(".todo-item");
  const data = [];

  items.forEach((item) => {
    data.push({
      text: item.querySelector(".todo-label").textContent,
      done: item.querySelector(".todo-checkbox").checked,
      createdAt: Number(item.dataset.createdAt),
    });
  });

  localStorage.setItem("todos", JSON.stringify(data));
}
function loadTodos() {
  const raw = localStorage.getItem("todos");
  if (!raw) return;

  const data = JSON.parse(raw);
  todoList.innerHTML = "";

  data.forEach((todo) => {
    const item = createTodoItem(todo.text, todo.done, todo.createdAt);
    todoList.appendChild(item);
  });
}

// -- 创建单个 Todo 元素 --
function createTodoItem(text, done = false, createdAt = Date.now()) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.draggable = false;
  li.dataset.createdAt = createdAt;

  // 拖拽手柄
  const handle = document.createElement("span");
  handle.className = "todo-handle";
  handle.textContent = "⠿";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.checked = done;

  // 文字区域（包含标签和时间）
  const textWrap = document.createElement("span");
  textWrap.className = "todo-text";

  const label = document.createElement("span");
  label.className = "todo-label";
  label.textContent = text;

  const time = document.createElement("span");
  time.className = "todo-time";
  time.textContent = formatTime(createdAt);

  textWrap.appendChild(label);
  textWrap.appendChild(time);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "todo-delete";
  deleteBtn.textContent = "删除";

  li.appendChild(handle);
  li.appendChild(checkbox);
  li.appendChild(textWrap);
  li.appendChild(deleteBtn);

  // 手柄拖拽控制
  handle.addEventListener("mousedown", () => { li.draggable = true; });
  handle.addEventListener("mouseup", () => { li.draggable = false; });

  return li;
}
// -- UI 状态更新 --
function updateUI() {
  const items = todoList.querySelectorAll(".todo-item");
  const total = items.length;
  const done = todoList.querySelectorAll(".todo-checkbox:checked").length;
  const pending = total - done;

  counterEl.textContent = `${pending} 项待办${done > 0 ? "，" + done + " 项已完成" : ""}`;
  clearBtn.classList.toggle("visible", done > 0);
  todoFooter.classList.toggle("visible", total > 0);
  emptyHint.classList.toggle("visible", total === 0);
}

// -- 筛选 --
function applyFilter() {
  const items = todoList.querySelectorAll(".todo-item");

  items.forEach((item) => {
    const isDone = item.querySelector(".todo-checkbox").checked;

    if (currentFilter === "all") {
      item.classList.remove("filtered-out");
    } else if (currentFilter === "pending") {
      item.classList.toggle("filtered-out", isDone);
    } else if (currentFilter === "done") {
      item.classList.toggle("filtered-out", !isDone);
    }
  });
}

filtersNav.addEventListener("click", (event) => {
  const btn = event.target.closest(".filter-btn");
  if (!btn) return;

  filtersNav.querySelector(".active").classList.remove("active");
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  applyFilter();
});

// -- 添加 Todo --
todoForm.addEventListener("click", (event) => {
  if (event.target.tagName !== "BUTTON") return;

  const text = todoInput.value.trim();
  if (!text) { todoInput.focus(); return; }

  const newItem = createTodoItem(text);
  newItem.classList.add("entering");
  todoList.appendChild(newItem);

  newItem.addEventListener("animationend", () => {
    newItem.classList.remove("entering");
  }, { once: true });

  todoInput.value = "";
  todoInput.focus();
  saveTodos();
  updateUI();
  applyFilter();
});

todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    todoForm.querySelector("button").click();
  }
});
// -- 删除 Todo --
todoList.addEventListener("click", (event) => {
  if (!event.target.classList.contains("todo-delete")) return;

  const item = event.target.closest(".todo-item");
  item.classList.add("removing");

  item.addEventListener("transitionend", () => {
    item.remove();
    saveTodos();
    updateUI();
  }, { once: true });
});

// -- 勾选 --
todoList.addEventListener("change", (event) => {
  if (!event.target.classList.contains("todo-checkbox")) return;
  saveTodos();
  updateUI();
  applyFilter();
});

// -- 清除已完成 --
clearBtn.addEventListener("click", () => {
  const completedItems = todoList.querySelectorAll(".todo-item:has(.todo-checkbox:checked)");

  completedItems.forEach((item) => {
    item.classList.add("removing");
    item.addEventListener("transitionend", () => {
      item.remove();
      saveTodos();
      updateUI();
    }, { once: true });
  });
});

// -- 双击编辑 --
todoList.addEventListener("dblclick", (event) => {
  const labelEl = event.target.closest(".todo-label");
  if (!labelEl) return;

  const item = labelEl.closest(".todo-item");
  if (item.classList.contains("editing")) return;

  const originalText = labelEl.textContent;
  item.classList.add("editing");

  const input = document.createElement("input");
  input.type = "text";
  input.className = "todo-edit-input";
  input.value = originalText;

  const textWrap = item.querySelector(".todo-text");
  textWrap.after(input);
  input.focus();
  input.select();

  function saveEdit() {
    const newText = input.value.trim();
    if (newText && newText !== originalText) {
      labelEl.textContent = newText;
      saveTodos();
    }
    exitEdit();
  }

  function exitEdit() {
    item.classList.remove("editing");
    input.remove();
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); saveEdit(); }
    else if (e.key === "Escape") { exitEdit(); }
  });

  input.addEventListener("blur", saveEdit);
});
// ===== 拖拽排序（桌面端） =====
let draggedItem = null;

todoList.addEventListener("dragstart", (event) => {
  const item = event.target.closest(".todo-item");
  if (!item) return;
  draggedItem = item;
  requestAnimationFrame(() => { item.classList.add("dragging"); });
});

todoList.addEventListener("dragend", (event) => {
  const item = event.target.closest(".todo-item");
  if (!item) return;
  item.classList.remove("dragging");
  item.draggable = false;
  draggedItem = null;
  clearDropIndicators();
  saveTodos();
});

todoList.addEventListener("dragover", (event) => {
  event.preventDefault();
  const target = event.target.closest(".todo-item");
  if (!target || target === draggedItem) return;

  clearDropIndicators();
  const rect = target.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;

  if (event.clientY < midY) {
    target.classList.add("drop-above");
    todoList.insertBefore(draggedItem, target);
  } else {
    target.classList.add("drop-below");
    todoList.insertBefore(draggedItem, target.nextSibling);
  }
});

todoList.addEventListener("dragleave", (event) => {
  const target = event.target.closest(".todo-item");
  if (!target) return;
  target.classList.remove("drop-above", "drop-below");
});

todoList.addEventListener("drop", (event) => {
  event.preventDefault();
  clearDropIndicators();
});

function clearDropIndicators() {
  todoList.querySelectorAll(".drop-above, .drop-below").forEach((el) => {
    el.classList.remove("drop-above", "drop-below");
  });
}

// ===== 移动端 Touch 拖拽 =====
let touchDragItem = null;
let touchOffsetY = 0;
let placeholder = null;

todoList.addEventListener("touchstart", (event) => {
  const handle = event.target.closest(".todo-handle");
  if (!handle) return;
  const item = handle.closest(".todo-item");
  if (!item) return;

  touchDragItem = item;
  const rect = item.getBoundingClientRect();
  touchOffsetY = event.touches[0].clientY - rect.top;

  placeholder = document.createElement("li");
  placeholder.className = "todo-placeholder";
  placeholder.style.height = rect.height + "px";

  item.classList.add("touch-dragging");
  item.style.width = rect.width + "px";
  item.style.top = rect.top + "px";
  item.style.left = rect.left + "px";

  todoList.insertBefore(placeholder, item);
  document.body.appendChild(item);
}, { passive: true });

todoList.addEventListener("touchmove", (event) => {
  if (!touchDragItem) return;
  event.preventDefault();

  const touch = event.touches[0];
  touchDragItem.style.top = (touch.clientY - touchOffsetY) + "px";

  const target = getItemAtPosition(touch.clientY);
  if (!target || target === placeholder) return;

  clearDropIndicators();
  const rect = target.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;

  if (touch.clientY < midY) {
    target.classList.add("drop-above");
    todoList.insertBefore(placeholder, target);
  } else {
    target.classList.add("drop-below");
    todoList.insertBefore(placeholder, target.nextSibling);
  }
}, { passive: false });

document.addEventListener("touchend", () => {
  if (!touchDragItem) return;
  touchDragItem.classList.remove("touch-dragging");
  touchDragItem.style.width = "";
  touchDragItem.style.top = "";
  touchDragItem.style.left = "";
  todoList.insertBefore(touchDragItem, placeholder);
  placeholder.remove();
  clearDropIndicators();
  saveTodos();
  touchDragItem = null;
  placeholder = null;
});

function getItemAtPosition(y) {
  const items = todoList.querySelectorAll(".todo-item:not(.touch-dragging)");
  for (const item of items) {
    const rect = item.getBoundingClientRect();
    if (y >= rect.top && y <= rect.bottom) return item;
  }
  return null;
}

// ===== 初始化 =====
loadTodos();
updateUI();
applyFilter();
