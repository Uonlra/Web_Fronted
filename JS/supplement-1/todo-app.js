// ============================================
// TODO App —— 纯 JS + DOM 操作 + localStorage
// ============================================
// 这个文件展示了前端开发中最核心的技能：
// 1. DOM 选择和操作
// 2. 事件监听和事件委托
// 3. localStorage 数据持久化
// 4. 状态管理思维（数据驱动视图）

// ============================================
// 状态管理
// ============================================

// 从 localStorage 读取数据，如果没有就用空数组
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all"; // 当前筛选状态

// ============================================
// DOM 元素选择
// ============================================

const todoInput = document.querySelector("#todo-input");
const addBtn = document.querySelector("#add-btn");
const todoList = document.querySelector("#todo-list");
const filterGroup = document.querySelector("#filter-group");
const statsEl = document.querySelector("#stats");

// ============================================
// 核心函数
// ============================================

// 生成唯一 ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// 保存到 localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 添加任务
function addTodo() {
  const text = todoInput.value.trim();

  // 输入验证
  if (!text) {
    todoInput.focus();
    return;
  }

  // 创建新任务对象
  const newTodo = {
    id: generateId(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  // 添加到数组开头（新任务在最上面）
  todos.unshift(newTodo);

  // 保存并重新渲染
  saveTodos();
  render();

  // 清空输入框
  todoInput.value = "";
  todoInput.focus();
}

// 切换任务完成状态
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    render();
  }
}

// 删除任务
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

// 清除所有已完成任务
function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  render();
}

// ============================================
// 渲染函数 —— 数据驱动视图的核心
// ============================================

function render() {
  // 根据筛选条件过滤
  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true; // "all"
  });

  // 清空列表
  todoList.innerHTML = "";

  // 空状态
  if (filteredTodos.length === 0) {
    todoList.innerHTML = '<li class="empty-state">暂无任务</li>';
  } else {
    // 遍历并创建 DOM 元素
    filteredTodos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;
      li.dataset.id = todo.id;

      li.innerHTML = `
        <input type="checkbox" ${todo.completed ? "checked" : ""}>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="delete-btn">删除</button>
      `;

      todoList.appendChild(li);
    });
  }

  // 更新统计
  renderStats();
}

// 防止 XSS：转义 HTML 特殊字符
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 渲染统计信息
function renderStats() {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;

  statsEl.innerHTML = `
    <span>共 ${total} 项，未完成 ${active} 项</span>
    ${completed > 0 ? '<button id="clear-completed-btn">清除已完成</button>' : ""}
  `;
}

// ============================================
// 事件绑定
// ============================================

// 添加按钮点击
addBtn.addEventListener("click", addTodo);

// 回车键添加
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// 事件委托 —— 处理列表内的点击事件
todoList.addEventListener("click", (e) => {
  const item = e.target.closest(".todo-item");
  if (!item) return;

  const id = item.dataset.id;

  // 点击 checkbox
  if (e.target.type === "checkbox") {
    toggleTodo(id);
  }

  // 点击删除按钮
  if (e.target.classList.contains("delete-btn")) {
    deleteTodo(id);
  }
});

// 筛选按钮 —— 事件委托
filterGroup.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter-btn")) return;

  // 更新 active 状态
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  e.target.classList.add("active");

  // 更新筛选条件并重新渲染
  currentFilter = e.target.dataset.filter;
  render();
});

// 清除已完成 —— 事件委托（因为按钮是动态生成的）
statsEl.addEventListener("click", (e) => {
  if (e.target.id === "clear-completed-btn") {
    clearCompleted();
  }
});

// ============================================
// 初始化
// ============================================
render();

// ============================================
// 学习要点总结
// ============================================
/*
这个 TODO 应用涵盖了以下核心知识点：

1. DOM 操作：
   - querySelector 选择元素
   - createElement 创建元素
   - innerHTML 设置内容
   - classList 操作 class
   - dataset 读写自定义属性
   - closest() 向上查找祖先元素

2. 事件处理：
   - addEventListener 绑定事件
   - 事件委托（父元素监听，event.target 判断）
   - keydown 监听键盘
   - 阻止默认行为

3. localStorage：
   - setItem / getItem 存取数据
   - JSON.stringify / JSON.parse 序列化

4. 编程思维：
   - 数据驱动视图（修改数据 → 重新渲染）
   - 状态管理（todos 数组就是"单一数据源"）
   - 关注点分离（数据操作和 DOM 渲染分开）

这些就是 React/Vue 等框架的底层思想！
框架只是把这些手动操作自动化了。
*/
