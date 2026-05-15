# DOM 操作和事件处理

前端核心基础：浏览器会把 HTML 解析成一棵 DOM 树，JavaScript 通过 DOM API 操作这棵树。

## 1. 选择元素

```javascript
// 通过 ID 选择（返回单个元素）
// CSS id 用 #，JS 用 getElementById()，不带 #
const title = document.getElementById("title");

// 通过 CSS 选择器选择（返回第一个匹配的元素）
const firstButton = document.querySelector(".btn");
const nav = document.querySelector("#nav > ul"); // ul 是 nav 的直接子元素

// 选择所有匹配的元素（返回 NodeList，类似数组）
const allButtons = document.querySelectorAll(".btn"); // .btn 选择所有 class="btn" 的元素
const allItems = document.querySelectorAll("li");

// 遍历 NodeList
allButtons.forEach((btn) => {
  console.log(btn.textContent);
});
```

## 2. 修改内容

```javascript
// textContent —— 纯文本（推荐，更安全）
title.textContent = "新标题";

// innerHTML —— 可以插入 HTML（注意 XSS 风险）
title.innerHTML = "<em>带样式的标题</em>";

// 修改表单元素的值
const input = document.querySelector("#username");
input.value = "Tom";
```

## 3. 修改样式

```javascript
// 直接修改 style（行内样式）
title.style.color = "red";
title.style.fontSize = "24px";
title.style.backgroundColor = "#f0f0f0";

// 通过 class 控制样式（推荐）
title.classList.add("active"); // 添加 class
title.classList.remove("active"); // 移除 class
title.classList.toggle("active"); // 有则移除，无则添加
title.classList.contains("active"); // 判断是否有某个 class
```

## 4. 修改属性

```javascript
const link = document.querySelector("a");
link.setAttribute("href", "https://example.com");
link.getAttribute("href"); // 读取 href 属性
link.removeAttribute("target");

// data-* 自定义属性
const card = document.querySelector(".card");
card.dataset.id = "123"; // 设置 data-id="123"
console.log(card.dataset.id); // 读取 data-id
```

## 5. 创建和插入元素

```javascript
// 创建新元素
const newItem = document.createElement("li");
newItem.textContent = "新的列表项";
newItem.classList.add("item");

// 插入到父元素末尾
const list = document.querySelector("ul");
list.appendChild(newItem);

// 插入到某个元素前面
const firstItem = list.firstElementChild;
list.insertBefore(newItem, firstItem);

// 更现代的插入方式
list.append(newItem); // 末尾（可以插入文本）
list.prepend(newItem); // 开头
firstItem.before(newItem); // 某元素前
firstItem.after(newItem); // 某元素后
```

## 6. 删除元素

```javascript
const itemToRemove = document.querySelector(".old-item");
itemToRemove.remove(); // 直接删除自己

// 或者通过父元素删除
list.removeChild(itemToRemove);
```

## 7. 事件监听

```javascript
// 基本用法
const btn = document.querySelector("#submit-btn");

btn.addEventListener("click", () => {
  console.log("按钮被点击了");
});

// 带事件对象
btn.addEventListener("click", (event) => {
  console.log("事件类型:", event.type);
  console.log("目标元素:", event.target);
  event.preventDefault(); // 阻止默认行为（如表单提交）
});
```

## 8. 常见事件类型

鼠标事件：

| 事件 | 说明 |
| --- | --- |
| `click` | 点击 |
| `dblclick` | 双击 |
| `mouseenter` | 鼠标移入 |
| `mouseleave` | 鼠标移出 |

键盘事件：

```javascript
document.addEventListener("keydown", (e) => {
  console.log("按下了:", e.key);
  if (e.key === "Enter") {
    console.log("回车！");
  }
});
```

表单事件：

```javascript
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // 阻止页面刷新
  const formData = new FormData(form);
  console.log("表单数据:", Object.fromEntries(formData));
});

// input 事件（实时监听输入）
const searchInput = document.querySelector("#search");
searchInput.addEventListener("input", (e) => {
  console.log("当前输入:", e.target.value);
});

// change 事件（失去焦点后触发）
searchInput.addEventListener("change", (e) => {
  console.log("最终值:", e.target.value);
});
```

## 9. 事件委托

事件委托的核心思路：不给每个子元素单独绑定事件，而是把事件监听绑定在父元素上。利用事件冒泡机制，通过 `event.target` 判断实际触发事件的是哪个子元素。

```javascript
const todoList = document.querySelector("#todo-list");

todoList.addEventListener("click", (e) => {
  // 判断点击的是不是删除按钮
  if (e.target.classList.contains("delete-btn")) {
    const item = e.target.closest("li"); // 找到最近的 li 祖先
    item.remove();
  }

  // 判断点击的是不是 checkbox
  if (e.target.type === "checkbox") {
    const item = e.target.closest("li");
    item.classList.toggle("completed"); // toggle 表示有就移除，没有就添加
  }
});
```

事件委托的好处：

1. 动态添加的元素也能响应事件。
2. 只绑定一个监听器，性能更好。
3. 代码更简洁。

## 10. localStorage 本地存储

```javascript
// 存储数据（只能存字符串，对象需要 JSON.stringify）
localStorage.setItem("username", "Tom");
localStorage.setItem(
  "todos",
  JSON.stringify([
    // 将对象转换成字符串
    { id: 1, text: "学习 JS", done: false },
    { id: 2, text: "做项目", done: true },
  ])
);

// 读取数据
const username = localStorage.getItem("username");
const todos = JSON.parse(localStorage.getItem("todos")); // 将字符串转换回对象

console.log(username); // "Tom"
console.log(todos); // [{...}, {...}]

// 删除某一项
localStorage.removeItem("username");

// 清空所有
localStorage.clear();
```

## 重点总结

### 选择元素

```javascript
document.getElementById();
document.querySelector();
document.querySelectorAll();
```

### 修改内容

```javascript
element.textContent;
element.innerHTML;
element.value;
```

### 修改样式

```javascript
element.style.xxx;
element.classList.add();
element.classList.remove();
element.classList.toggle();
```

### 创建插入

```javascript
document.createElement();
parent.appendChild();
parent.append();
parent.prepend();
```

### 事件

```javascript
element.addEventListener("事件名", 回调函数);
event.target; // 触发事件的元素
event.preventDefault(); // 阻止默认行为
```

事件委托：把事件绑定在父元素上，通过 `event.target` 判断实际触发事件的子元素。

### 本地存储

```javascript
localStorage.setItem(key, value);
localStorage.getItem(key);
localStorage.removeItem(key);
JSON.stringify();
JSON.parse();
```
