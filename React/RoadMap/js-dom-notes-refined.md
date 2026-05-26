# JS DOM 语法精炼笔记

DOM（Document Object Model）是浏览器把 HTML 解析后生成的对象树。JavaScript 可以通过 DOM API 读取、修改页面结构、内容、样式，并响应用户事件。

## 1. 选择元素

```js
// 按 id 选择，返回单个元素或 null
const title = document.getElementById("title");

// 按 CSS 选择器选择，返回第一个匹配元素或 null
const firstButton = document.querySelector(".btn");
const navList = document.querySelector("#nav > ul");

// 返回所有匹配元素，结果是 NodeList
const buttons = document.querySelectorAll(".btn");

buttons.forEach((button) => {
  console.log(button.textContent);
});
```

常用结论：

- `getElementById("title")` 不写 `#`。
- `querySelector()` / `querySelectorAll()` 写 CSS 选择器。
- 查不到元素时通常返回 `null`，操作前可以先判断。

```js
const box = document.querySelector(".box");

if (box) {
  box.textContent = "找到元素了";
}
```

## 2. 修改内容和值

```js
const title = document.querySelector("#title");
const input = document.querySelector("#username");

// 修改纯文本，推荐优先使用
title.textContent = "新标题";

// 插入 HTML，注意不要直接插入不可信内容
title.innerHTML = "<em>带强调的标题</em>";

// 表单元素使用 value
input.value = "Tom";
```

对比：

| API | 用途 | 注意点 |
| --- | --- | --- |
| `textContent` | 修改纯文本 | 更安全，常用 |
| `innerHTML` | 插入 HTML 字符串 | 有 XSS 风险 |
| `value` | 读取或修改表单值 | 用于 `input`、`textarea`、`select` |

## 3. 修改样式和 class

```js
const card = document.querySelector(".card");

// 直接改行内样式
card.style.color = "red";
card.style.fontSize = "24px";
card.style.backgroundColor = "#f5f5f5";

// 用 class 控制样式，项目中更推荐
card.classList.add("active");
card.classList.remove("active");
card.classList.toggle("active");

if (card.classList.contains("active")) {
  console.log("当前是激活状态");
}
```

建议：少量临时样式可以用 `style`，状态切换和复杂样式优先用 `classList`。

## 4. 修改属性和 data 属性

```js
const link = document.querySelector("a");

link.setAttribute("href", "https://example.com");
link.setAttribute("target", "_blank");

console.log(link.getAttribute("href"));

link.removeAttribute("target");
```

`data-*` 适合在 HTML 上保存和元素相关的小数据。

```html
<button class="delete-btn" data-id="101">删除</button>
```

```js
const button = document.querySelector(".delete-btn");

console.log(button.dataset.id); // "101"
button.dataset.id = "102"; // 修改 data-id
```

## 5. 创建、插入和删除元素

```js
const list = document.querySelector("#todo-list");

const item = document.createElement("li");
item.classList.add("todo-item");
item.textContent = "学习 DOM";

// 插入到末尾
list.append(item);

// 插入到开头
list.prepend(item);
```

更多插入方式：

```js
const firstItem = list.firstElementChild;

firstItem.before(item); // 插到某元素前面
firstItem.after(item);  // 插到某元素后面
```

删除元素：

```js
const oldItem = document.querySelector(".old-item");

if (oldItem) {
  oldItem.remove();
}
```

## 6. 事件监听

```js
const button = document.querySelector("#submit-btn");

button.addEventListener("click", (event) => {
  console.log("事件类型:", event.type);
  console.log("触发元素:", event.target);
});
```

常用事件对象属性和方法：

| 写法 | 作用 |
| --- | --- |
| `event.target` | 真正触发事件的元素 |
| `event.currentTarget` | 当前绑定事件的元素 |
| `event.preventDefault()` | 阻止默认行为 |
| `event.stopPropagation()` | 阻止事件继续冒泡 |

## 7. 常见事件

鼠标事件：

| 事件 | 触发时机 |
| --- | --- |
| `click` | 点击 |
| `dblclick` | 双击 |
| `mouseenter` | 鼠标进入元素 |
| `mouseleave` | 鼠标离开元素 |

键盘事件：

```js
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    console.log("按下了回车");
  }
});
```

表单事件：

```js
const form = document.querySelector("#login-form");
const usernameInput = document.querySelector("#username");

usernameInput.addEventListener("input", (event) => {
  console.log("实时输入:", event.target.value);
});

usernameInput.addEventListener("change", (event) => {
  console.log("最终值:", event.target.value);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  console.log(data);
});
```

对比：

- `input`：输入内容变化时立即触发。
- `change`：值确认变化后触发，常见于失焦后。
- `submit`：表单提交时触发，通常配合 `preventDefault()`。

## 8. 事件冒泡和事件委托

事件冒泡：子元素触发事件后，事件会一层层传到父元素。

事件委托：把事件绑定到父元素，通过 `event.target` 判断用户点的是哪个子元素。

```js
const todoList = document.querySelector("#todo-list");

todoList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-btn");

  if (deleteButton) {
    const item = deleteButton.closest("li");
    item.remove();
    return;
  }

  if (event.target.matches("input[type='checkbox']")) {
    const item = event.target.closest("li");
    item.classList.toggle("completed", event.target.checked);
  }
});
```

事件委托的优点：

- 动态新增的子元素也能响应事件。
- 父元素只需要绑定一次事件。
- 列表、菜单、表格等场景非常常用。

常用搭配：

```js
event.target.matches(".btn");
event.target.closest(".item");
```

## 9. localStorage 本地存储

`localStorage` 可以把数据保存在浏览器中，刷新页面后仍然存在。它只能存字符串，对象和数组需要用 JSON 转换。

```js
const todos = [
  { id: 1, text: "学习 JS", done: false },
  { id: 2, text: "做项目", done: true },
];

// 保存
localStorage.setItem("todos", JSON.stringify(todos));

// 读取，给一个默认值避免 null 报错
const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");

// 删除指定 key
localStorage.removeItem("todos");

// 清空当前网站下的所有 localStorage
localStorage.clear();
```

常用封装：

```js
function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  return JSON.parse(localStorage.getItem("todos") || "[]");
}
```

## 10. 页面加载后再操作 DOM

如果脚本写在 HTML 头部，DOM 可能还没创建完成。可以使用 `DOMContentLoaded`：

```js
document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app");
  app.textContent = "页面加载完成";
});
```

如果 `<script>` 写在 `</body>` 前，通常可以直接操作 DOM。

## 高频速查

```js
// 选择
document.getElementById("id");
document.querySelector(".class");
document.querySelectorAll("li");

// 内容和值
element.textContent = "文本";
element.innerHTML = "<span>HTML</span>";
input.value = "输入值";

// 样式和 class
element.style.color = "red";
element.classList.add("active");
element.classList.remove("active");
element.classList.toggle("active");
element.classList.contains("active");

// 属性
element.setAttribute("href", "https://example.com");
element.getAttribute("href");
element.removeAttribute("href");
element.dataset.id;

// 创建和删除
document.createElement("li");
parent.append(child);
parent.prepend(child);
element.before(newElement);
element.after(newElement);
element.remove();

// 事件
element.addEventListener("click", callback);
event.target;
event.currentTarget;
event.preventDefault();
event.stopPropagation();

// 判断元素
element.matches(".btn");
element.closest(".item");

// 本地存储
localStorage.setItem("key", "value");
localStorage.getItem("key");
localStorage.removeItem("key");
JSON.stringify(data);
JSON.parse(text);
```

## 学习重点

1. 先会选元素：`querySelector` 和 `querySelectorAll` 最常用。
2. 修改内容优先用 `textContent`，需要 HTML 时才用 `innerHTML`。
3. 样式切换优先用 `classList`，不要把大量样式写进 JS。
4. 事件处理重点理解 `event.target`、`preventDefault()` 和事件委托。
5. 保存数组或对象到 `localStorage` 时，记住 `JSON.stringify()` 和 `JSON.parse()` 成对使用。
