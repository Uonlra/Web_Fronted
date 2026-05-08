const STORAGE_KEY = "vibeCodingTodoList";

const defaultTodos = [
  {
    id: 1,
    title: "学习 JavaScript",
    completed: false,
    createdAt: "2026-05-07",
    updatedAt: "2026-05-07"
  },
  {
    id: 2,
    title: "练习数组方法",
    completed: true,
    createdAt: "2026-05-07",
    updatedAt: "2026-05-07"
  },
  {
    id: 3,
    title: "完成 Todo 项目",
    completed: false,
    createdAt: "2026-05-07",
    updatedAt: "2026-05-07"
  }
];

const todoManager = {
  nextId: 4,
  todos: [...defaultTodos],

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  },

  syncNextId() {
    const maxId = this.todos.reduce((max, todo) => {
      return todo.id > max ? todo.id : max;
    }, 0);

    this.nextId = maxId + 1;
  },

  addTodo(title) {
    const trimmedTitle = title.trim();

    if (trimmedTitle === "") {
      return false;
    }

    const today = this.formatDate(new Date());

    const newTodo = {
      id: this.nextId,
      title: trimmedTitle,
      completed: false,
      createdAt: today,
      updatedAt: today
    };

    this.todos.push(newTodo);
    this.nextId++;

    return true;
  },

  deleteTodo(id) {
    const oldLength = this.todos.length;

    this.todos = this.todos.filter(todo => todo.id !== id);

    return this.todos.length < oldLength;
  },

  toggleTodo(id) {
    let updated = false;
    const today = this.formatDate(new Date());

    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        updated = true;

        return {
          ...todo,
          completed: !todo.completed,
          updatedAt: today
        };
      }

      return todo;
    });

    return updated;
  },

  updateTodoTitle(id, newTitle) {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === "") {
      return false;
    }

    let updated = false;
    const today = this.formatDate(new Date());

    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        updated = true;

        return {
          ...todo,
          title: trimmedTitle,
          updatedAt: today
        };
      }

      return todo;
    });

    return updated;
  },

  clearCompleted() {
    const oldLength = this.todos.length;

    this.todos = this.todos.filter(todo => !todo.completed);

    return oldLength - this.todos.length;
  },

  getFilteredTodos(filter) {
    if (filter === "completed") {
      return this.todos.filter(todo => todo.completed);
    }

    if (filter === "active") {
      return this.todos.filter(todo => !todo.completed);
    }

    return this.todos;
  },

  getTodoStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(todo => todo.completed).length;
    const active = this.todos.filter(todo => !todo.completed).length;
    const completedRate = total === 0
      ? "0%"
      : `${((completed / total) * 100).toFixed(0)}%`;

    return {
      total,
      completed,
      active,
      completedRate
    };
  },

  toJson() {
    return JSON.stringify(this.todos);
  },

  loadFromJson(jsonText) {
    try {
      const parsedTodos = JSON.parse(jsonText);

      if (!Array.isArray(parsedTodos)) {
        return false;
      }

      this.todos = parsedTodos;
      this.syncNextId();

      return true;
    } catch (error) {
      return false;
    }
  }
};

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
  clearCompletedButton: document.querySelector("#clearCompletedButton")
};

let currentFilter = "all";

function loadTodos() {
  const savedTodos = localStorage.getItem(STORAGE_KEY);

  if (!savedTodos) {
    saveTodos();
    return;
  }

  const loaded = todoManager.loadFromJson(savedTodos);

  if (!loaded) {
    todoManager.todos = [...defaultTodos];
    todoManager.syncNextId();
    saveTodos();
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, todoManager.toJson());
}

function showMessage(text) {
  elements.message.textContent = text;
}

function clearMessage() {
  showMessage("");
}

function createTodoElement(todo) {
  const item = document.createElement("li");
  item.className = "todo-item";

  const checkbox = document.createElement("input");
  checkbox.className = "todo-checkbox";
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.dataset.action = "toggle";
  checkbox.dataset.id = String(todo.id);
  checkbox.setAttribute("aria-label", `切换 ${todo.title} 的完成状态`);

  const content = document.createElement("div");

  const title = document.createElement("span");
  title.className = todo.completed ? "todo-title completed" : "todo-title";
  title.textContent = todo.title;

  const meta = document.createElement("div");
  meta.className = "todo-meta";
  meta.textContent = `创建：${todo.createdAt} / 更新：${todo.updatedAt}`;

  content.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "todo-actions";

  const editButton = document.createElement("button");
  editButton.className = "todo-action";
  editButton.type = "button";
  editButton.textContent = "编辑";
  editButton.dataset.action = "edit";
  editButton.dataset.id = String(todo.id);

  const deleteButton = document.createElement("button");
  deleteButton.className = "todo-action delete";
  deleteButton.type = "button";
  deleteButton.textContent = "删除";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = String(todo.id);

  actions.append(editButton, deleteButton);
  item.append(checkbox, content, actions);

  return item;
}

function renderTodos() {
  const visibleTodos = todoManager.getFilteredTodos(currentFilter);

  elements.list.replaceChildren();

  for (const todo of visibleTodos) {
    elements.list.append(createTodoElement(todo));
  }

  elements.emptyState.classList.toggle("visible", visibleTodos.length === 0);
}

function renderStats() {
  const stats = todoManager.getTodoStats();

  elements.totalCount.textContent = stats.total;
  elements.completedCount.textContent = stats.completed;
  elements.activeCount.textContent = stats.active;
  elements.completedRate.textContent = stats.completedRate;
}

function renderFilterButtons() {
  for (const button of elements.filterButtons) {
    button.classList.toggle("active", button.dataset.filter === currentFilter);
  }
}

function renderApp() {
  renderTodos();
  renderStats();
  renderFilterButtons();
}

function handleAddTodo(event) {
  event.preventDefault();

  const added = todoManager.addTodo(elements.input.value);

  if (!added) {
    showMessage("Todo 标题不能为空");
    return;
  }

  elements.input.value = "";
  clearMessage();
  saveTodos();
  renderApp();
}

function handleTodoListClick(event) {
  const target = event.target;
  const action = target.dataset.action;
  const id = Number(target.dataset.id);

  if (!action || Number.isNaN(id)) {
    return;
  }

  if (action === "toggle") {
    todoManager.toggleTodo(id);
  }

  if (action === "delete") {
    todoManager.deleteTodo(id);
  }

  if (action === "edit") {
    const todo = todoManager.todos.find(item => item.id === id);

    if (!todo) {
      return;
    }

    const nextTitle = window.prompt("请输入新的 Todo 标题", todo.title);

    if (nextTitle === null) {
      return;
    }

    const updated = todoManager.updateTodoTitle(id, nextTitle);

    if (!updated) {
      showMessage("新的标题不能为空");
      return;
    }
  }

  clearMessage();
  saveTodos();
  renderApp();
}

function handleFilterClick(event) {
  const filter = event.target.dataset.filter;

  if (!filter) {
    return;
  }

  currentFilter = filter;
  renderApp();
}

function handleClearCompleted() {
  const removedCount = todoManager.clearCompleted();

  if (removedCount === 0) {
    showMessage("没有已完成的 Todo");
    return;
  }

  clearMessage();
  saveTodos();
  renderApp();
}

elements.form.addEventListener("submit", handleAddTodo);
elements.list.addEventListener("click", handleTodoListClick);
elements.clearCompletedButton.addEventListener("click", handleClearCompleted);

for (const button of elements.filterButtons) {
  button.addEventListener("click", handleFilterClick);
}

loadTodos();
renderApp();
