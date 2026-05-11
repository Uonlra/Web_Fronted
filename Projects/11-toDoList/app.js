const STORAGE_KEY = "vibeCodingTodoList";

const defaultTodos = [
  { id: 1, title: "学习 JavaScript", completed: false, order: 0, createdAt: "2026-05-07", updatedAt: "2026-05-07" },
  { id: 2, title: "练习数组方法", completed: true, order: 1, createdAt: "2026-05-07", updatedAt: "2026-05-07" },
  { id: 3, title: "完成 Todo 项目", completed: false, order: 2, createdAt: "2026-05-07", updatedAt: "2026-05-07" }
];

const todoManager = {
  nextId: 4,
  todos: [...defaultTodos],

  formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  },

  syncNextId() {
    const maxId = this.todos.reduce((max, t) => (t.id > max ? t.id : max), 0);
    this.nextId = maxId + 1;
  },

  addTodo(title) {
    const trimmed = title.trim();
    if (trimmed === "") return false;

    const today = this.formatDate(new Date());
    const maxOrder = this.todos.reduce((max, t) => (t.order > max ? t.order : max), -1);

    this.todos.push({
      id: this.nextId,
      title: trimmed,
      completed: false,
      order: maxOrder + 1,
      createdAt: today,
      updatedAt: today
    });
    this.nextId++;
    return true;
  },

  deleteTodo(id) {
    const oldLen = this.todos.length;
    this.todos = this.todos.filter(t => t.id !== id);
    return this.todos.length < oldLen;
  },

  toggleTodo(id) {
    let updated = false;
    const today = this.formatDate(new Date());
    this.todos = this.todos.map(t => {
      if (t.id === id) { updated = true; return { ...t, completed: !t.completed, updatedAt: today }; }
      return t;
    });
    return updated;
  },

  updateTodoTitle(id, newTitle) {
    const trimmed = newTitle.trim();
    if (trimmed === "") return false;
    let updated = false;
    const today = this.formatDate(new Date());
    this.todos = this.todos.map(t => {
      if (t.id === id) { updated = true; return { ...t, title: trimmed, updatedAt: today }; }
      return t;
    });
    return updated;
  },

  clearCompleted() {
    const oldLen = this.todos.length;
    this.todos = this.todos.filter(t => !t.completed);
    return oldLen - this.todos.length;
  },

  getFilteredTodos(filter) {
    let list = this.todos;
    if (filter === "completed") list = list.filter(t => t.completed);
    else if (filter === "active") list = list.filter(t => !t.completed);
    return list.slice().sort((a, b) => a.order - b.order);
  },

  getTodoStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;
    const active = total - completed;
    const completedRate = total === 0 ? "0%" : `${((completed / total) * 100).toFixed(0)}%`;
    return { total, completed, active, completedRate };
  },

  applyOrder(orderedIds) {
    for (let i = 0; i < orderedIds.length; i++) {
      const todo = this.todos.find(t => t.id === orderedIds[i]);
      if (todo) todo.order = i;
    }
  },

  toJson() { return JSON.stringify(this.todos); },

  loadFromJson(jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) return false;
      this.todos = parsed.map((t, i) => ({ ...t, order: t.order ?? i }));
      this.syncNextId();
      return true;
    } catch { return false; }
  }
};

// --- DOM refs ---

const elements = {
  form: document.querySelector("#todoForm"),
  input: document.querySelector("#todoInput"),
  message: document.querySelector("#message"),
  list: document.querySelector("#todoList"),
  emptyState: document.querySelector("#emptyState"),
  totalCount: document.querySelector("#totalCount"),
  completedCount: document.querySelector("#completedCount"),
  activeCount: document.querySelector("#activeCount"),
  completedRate: document.querySelector("#completedRate"),
  filterButtons: document.querySelectorAll(".filter-button"),
  clearCompletedButton: document.querySelector("#clearCompletedButton"),
  toastContainer: document.querySelector("#toastContainer")
};

let currentFilter = "all";

// --- Toast ---

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast-visible"));
  setTimeout(() => {
    toast.classList.add("toast-exit");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, 2500);
}

// --- Persistence ---

function loadTodos() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) { saveTodos(); return; }
  if (!todoManager.loadFromJson(saved)) {
    todoManager.todos = [...defaultTodos];
    todoManager.syncNextId();
    saveTodos();
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, todoManager.toJson());
}

// --- Messages ---

function showMessage(text) { elements.message.textContent = text; }
function clearMessage() { showMessage(""); }

// --- Rendering ---

function createTodoElement(todo) {
  const item = document.createElement("li");
  item.className = "todo-item";
  item.dataset.id = String(todo.id);

  const handle = document.createElement("span");
  handle.className = "drag-handle";
  handle.setAttribute("aria-label", "拖拽排序");

  const checkbox = document.createElement("input");
  checkbox.className = "todo-checkbox";
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.dataset.action = "toggle";
  checkbox.dataset.id = String(todo.id);
  checkbox.setAttribute("aria-label", `切换 ${todo.title} 的完成状态`);

  const content = document.createElement("div");
  content.className = "todo-content";

  const title = document.createElement("span");
  title.className = todo.completed ? "todo-title completed" : "todo-title";
  title.textContent = todo.title;

  const meta = document.createElement("div");
  meta.className = "todo-meta";
  meta.textContent = `创建：${todo.createdAt} / 更新：${todo.updatedAt}`;

  content.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "todo-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "todo-action";
  editBtn.type = "button";
  editBtn.textContent = "编辑";
  editBtn.dataset.action = "edit";
  editBtn.dataset.id = String(todo.id);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "todo-action delete";
  deleteBtn.type = "button";
  deleteBtn.textContent = "删除";
  deleteBtn.dataset.action = "delete";
  deleteBtn.dataset.id = String(todo.id);

  actions.append(editBtn, deleteBtn);
  item.append(handle, checkbox, content, actions);
  return item;
}

function updateTodoElement(el, todo) {
  if (el.querySelector(".inline-edit-input")) return;

  const checkbox = el.querySelector(".todo-checkbox");
  checkbox.checked = todo.completed;

  const title = el.querySelector(".todo-title");
  title.textContent = todo.title;
  title.className = todo.completed ? "todo-title completed" : "todo-title";

  const meta = el.querySelector(".todo-meta");
  meta.textContent = `创建：${todo.createdAt} / 更新：${todo.updatedAt}`;
}

function animateOut(el) {
  el.classList.add("todo-exit");
  el.addEventListener("animationend", () => {
    el.remove();
    if (elements.list.children.length === 0) {
      elements.emptyState.classList.add("visible");
    }
  }, { once: true });
}

function renderTodos() {
  const visibleTodos = todoManager.getFilteredTodos(currentFilter);
  const existing = new Map();

  for (const child of [...elements.list.children]) {
    if (child.classList.contains("todo-exit")) continue;
    existing.set(Number(child.dataset.id), child);
  }

  const desiredIds = new Set(visibleTodos.map(t => t.id));

  // Remove items no longer visible
  const removingMany = [...existing].filter(([id]) => !desiredIds.has(id)).length > 10;
  for (const [id, el] of existing) {
    if (!desiredIds.has(id)) {
      if (removingMany) { el.remove(); }
      else { animateOut(el); }
    }
  }

  // Add / reorder
  for (let i = 0; i < visibleTodos.length; i++) {
    const todo = visibleTodos[i];
    let el = existing.get(todo.id);

    if (!el) {
      el = createTodoElement(todo);
      el.classList.add("todo-enter");
      el.addEventListener("animationend", () => el.classList.remove("todo-enter"), { once: true });
    } else {
      updateTodoElement(el, todo);
    }

    const current = elements.list.children[i];
    if (current !== el) {
      elements.list.insertBefore(el, current || null);
    }
  }

  elements.emptyState.classList.toggle("visible", visibleTodos.length === 0);
}

function renderStats() {
  const s = todoManager.getTodoStats();
  elements.totalCount.textContent = s.total;
  elements.completedCount.textContent = s.completed;
  elements.activeCount.textContent = s.active;
  elements.completedRate.textContent = s.completedRate;
}

function renderFilterButtons() {
  for (const btn of elements.filterButtons) {
    btn.classList.toggle("active", btn.dataset.filter === currentFilter);
  }
}

function renderApp() {
  renderTodos();
  renderStats();
  renderFilterButtons();
}

// --- Inline Edit ---

function startInlineEdit(id) {
  const todo = todoManager.todos.find(t => t.id === id);
  if (!todo) return;

  const li = elements.list.querySelector(`[data-id="${id}"]`);
  if (!li || li.querySelector(".inline-edit-input")) return;

  const titleSpan = li.querySelector(".todo-title");
  const contentDiv = li.querySelector(".todo-content");

  const input = document.createElement("input");
  input.type = "text";
  input.className = "inline-edit-input";
  input.value = todo.title;

  titleSpan.style.display = "none";
  contentDiv.insertBefore(input, titleSpan);
  input.focus();
  input.select();

  let cancelled = false;

  function commit() {
    if (cancelled) return;
    const updated = todoManager.updateTodoTitle(id, input.value);
    if (!updated) { showMessage("新的标题不能为空"); }
    else { showToast("已更新标题", "info"); }
    cleanup();
    saveTodos();
    renderApp();
  }

  function cancel() {
    cancelled = true;
    cleanup();
  }

  function cleanup() {
    input.removeEventListener("blur", commit);
    input.removeEventListener("keydown", handleKey);
    input.remove();
    titleSpan.style.display = "";
  }

  function handleKey(e) {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") { cancel(); }
  }

  input.addEventListener("keydown", handleKey);
  input.addEventListener("blur", commit);
}

// --- Drag and Drop ---

let dragState = null;

function initDragDrop() {
  elements.list.addEventListener("pointerdown", handleDragStart);
}

function handleDragStart(e) {
  const handle = e.target.closest(".drag-handle");
  if (!handle) return;

  const item = handle.closest(".todo-item");
  if (!item) return;

  e.preventDefault();
  const rect = item.getBoundingClientRect();
  const listRect = elements.list.getBoundingClientRect();

  dragState = {
    id: Number(item.dataset.id),
    el: item,
    startY: e.clientY,
    offsetY: e.clientY - rect.top,
    width: rect.width,
    listTop: listRect.top,
    started: false,
    placeholder: null,
    pointerId: e.pointerId
  };

  item.setPointerCapture(e.pointerId);
  document.addEventListener("pointermove", handleDragMove);
  document.addEventListener("pointerup", handleDragEnd);
}

function handleDragMove(e) {
  if (!dragState) return;

  if (!dragState.started) {
    if (Math.abs(e.clientY - dragState.startY) < 5) return;
    dragState.started = true;
    dragState.el.classList.add("dragging");
    dragState.placeholder = document.createElement("li");
    dragState.placeholder.className = "todo-item drag-placeholder";
    dragState.placeholder.style.height = dragState.el.offsetHeight + "px";
    dragState.el.parentNode.insertBefore(dragState.placeholder, dragState.el);
    dragState.el.style.position = "fixed";
    dragState.el.style.width = dragState.width + "px";
    dragState.el.style.zIndex = "1000";
    dragState.el.style.left = dragState.el.parentNode.getBoundingClientRect().left + "px";
  }

  dragState.el.style.top = (e.clientY - dragState.offsetY) + "px";

  const siblings = [...elements.list.children].filter(
    c => c !== dragState.el && !c.classList.contains("drag-placeholder")
  );

  let inserted = false;
  for (const sib of siblings) {
    const r = sib.getBoundingClientRect();
    if (e.clientY < r.top + r.height / 2) {
      elements.list.insertBefore(dragState.placeholder, sib);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    elements.list.appendChild(dragState.placeholder);
  }
}

function handleDragEnd() {
  if (!dragState) return;

  document.removeEventListener("pointermove", handleDragMove);
  document.removeEventListener("pointerup", handleDragEnd);

  if (dragState.started) {
    dragState.el.classList.remove("dragging");
    dragState.el.style.position = "";
    dragState.el.style.width = "";
    dragState.el.style.zIndex = "";
    dragState.el.style.top = "";
    dragState.el.style.left = "";

    dragState.placeholder.replaceWith(dragState.el);

    const newOrder = [...elements.list.children]
      .filter(c => !c.classList.contains("todo-exit"))
      .map(c => Number(c.dataset.id));
    todoManager.applyOrder(newOrder);
    saveTodos();
  }

  dragState = null;
}

// --- Event Handlers ---

function handleAddTodo(event) {
  event.preventDefault();
  const added = todoManager.addTodo(elements.input.value);
  if (!added) { showMessage("Todo 标题不能为空"); return; }
  elements.input.value = "";
  clearMessage();
  saveTodos();
  renderApp();
  showToast("已添加待办", "success");
}

function handleTodoListClick(event) {
  const target = event.target;
  const action = target.dataset.action;
  const id = Number(target.dataset.id);
  if (!action || Number.isNaN(id)) return;

  if (action === "toggle") {
    todoManager.toggleTodo(id);
  } else if (action === "delete") {
    todoManager.deleteTodo(id);
    showToast("已删除待办", "danger");
  } else if (action === "edit") {
    startInlineEdit(id);
    return;
  }

  clearMessage();
  saveTodos();
  renderApp();
}

function handleFilterClick(event) {
  const filter = event.target.dataset.filter;
  if (!filter) return;
  currentFilter = filter;
  renderApp();
}

function handleClearCompleted() {
  const count = todoManager.clearCompleted();
  if (count === 0) { showMessage("没有已完成的 Todo"); return; }
  clearMessage();
  saveTodos();
  renderApp();
  showToast(`已清除 ${count} 个已完成项`, "success");
}

// --- Init ---

elements.form.addEventListener("submit", handleAddTodo);
elements.list.addEventListener("click", handleTodoListClick);
elements.clearCompletedButton.addEventListener("click", handleClearCompleted);
for (const btn of elements.filterButtons) {
  btn.addEventListener("click", handleFilterClick);
}

initDragDrop();
loadTodos();
renderApp();
