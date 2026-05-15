// ============================================
// ES6+ 进阶特性
// 现代前端开发必备语法
// ============================================

// ============================================
// 1. ES6 模块化（import / export）
// ============================================

// 命名导出（一个文件可以有多个）
// --- utils.js ---
// export const PI = 3.14159;
// export function add(a, b) { return a + b; }
// export function subtract(a, b) { return a - b; }

// 命名导入（用 {} 按名字导入）
// import { PI, add } from './utils.js';

// 默认导出（一个文件只能有一个）
// --- Button.js ---
// export default function Button() { ... }

// 默认导入（名字可以随便取）
// import Button from './Button.js';
// import MyButton from './Button.js'; // 也可以

// 混合使用
// import React, { useState, useEffect } from 'react';
//         ↑ 默认导出    ↑ 命名导出

// 重命名导入
// import { add as sum } from './utils.js';

// 全部导入
// import * as utils from './utils.js';
// utils.add(1, 2);

// ============================================
// 2. 可选链 ?.（Optional Chaining）
// ============================================

const user = {
  name: "Tom",
  address: {
    city: "Beijing",
  },
};

// 传统写法（防止报错）
const city1 = user && user.address && user.address.city;

// 可选链写法（简洁安全）
const city2 = user?.address?.city; // "Beijing"
const zip = user?.address?.zip; // undefined（不会报错）
const street = user?.location?.street; // undefined

// 可选链调用方法
const result = user?.getName?.(); // 如果 getName 不存在，返回 undefined

// 可选链访问数组
const users = [{ name: "Tom" }];
const firstName = users?.[0]?.name; // "Tom"
const secondName = users?.[1]?.name; // undefined

// ============================================
// 3. 空值合并 ??（Nullish Coalescing）
// ============================================

// ?? 只在左边是 null 或 undefined 时才用右边的值
// 和 || 的区别：|| 会把 0、""、false 也当作"空"

const count = 0;

console.log(count || 10); // 10 —— 0 被当作 falsy
console.log(count ?? 10); // 0  —— 0 不是 null/undefined

const text = "";
console.log(text || "默认"); // "默认" —— "" 被当作 falsy
console.log(text ?? "默认"); // ""     —— "" 不是 null/undefined

// 实际场景：处理 API 返回的数据
// const pageSize = response.data.pageSize ?? 20;

// ============================================
// 4. 短路赋值运算符
// ============================================

let a = null;
a ??= "默认值"; // 等价于 a = a ?? "默认值"
console.log(a); // "默认值"

let b = 0;
b ||= 10; // 等价于 b = b || 10
console.log(b); // 10（0 是 falsy）

let c = 1;
c &&= 2; // 等价于 c = c && 2（c 为真时才赋值）
console.log(c); // 2

// ============================================
// 5. 数组新方法
// ============================================

// Array.from —— 把类数组转成真数组
const nodeList = document.querySelectorAll("div"); // NodeList
const divArray = Array.from(nodeList); // 真数组，可以用 map/filter

// 生成数字序列
const nums = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(nums); // [1, 2, 3, 4, 5]

// flat —— 数组扁平化
const nested = [1, [2, 3], [4, [5, 6]]];
console.log(nested.flat()); // [1, 2, 3, 4, [5, 6]]
console.log(nested.flat(Infinity)); // [1, 2, 3, 4, 5, 6]

// flatMap —— map + flat(1)
const sentences = ["hello world", "foo bar"];
const words = sentences.flatMap((s) => s.split(" "));
console.log(words); // ["hello", "world", "foo", "bar"]

// at —— 支持负索引
const arr = [1, 2, 3, 4, 5];
console.log(arr.at(-1)); // 5（最后一个）
console.log(arr.at(-2)); // 4（倒数第二个）

// ============================================
// 6. 对象新方法
// ============================================

// Object.assign —— 合并对象（浅拷贝）
const target = { a: 1 };
const source = { b: 2, c: 3 };
Object.assign(target, source);
console.log(target); // { a: 1, b: 2, c: 3 }

// Object.fromEntries —— 把键值对数组转成对象
const entries = [
  ["name", "Tom"],
  ["age", 22],
];
const obj = Object.fromEntries(entries);
console.log(obj); // { name: "Tom", age: 22 }

// 配合 URLSearchParams 解析 URL 参数
// const params = new URLSearchParams("name=Tom&age=22");
// const paramsObj = Object.fromEntries(params);
// { name: "Tom", age: "22" }

// structuredClone —— 深拷贝（ES2022）
const original = {
  name: "Tom",
  address: { city: "Beijing" },
  date: new Date(),
};
const deepCopy = structuredClone(original);
deepCopy.address.city = "Shanghai";
console.log(original.address.city); // "Beijing"（不受影响）

// ============================================
// 7. 字符串新方法
// ============================================

const str = "Hello World";

// startsWith / endsWith
console.log(str.startsWith("Hello")); // true
console.log(str.endsWith("World")); // true

// repeat
console.log("ha".repeat(3)); // "hahaha"

// padStart / padEnd（补齐长度）
console.log("5".padStart(2, "0")); // "05"
console.log("42".padStart(5, " ")); // "   42"

// replaceAll
const msg = "foo-bar-baz";
console.log(msg.replaceAll("-", " ")); // "foo bar baz"

// ============================================
// 8. Map 和 Set
// ============================================

// Set —— 不重复的值的集合
const set = new Set([1, 2, 3, 3, 2, 1]);
console.log(set); // Set {1, 2, 3}
console.log(set.size); // 3

set.add(4);
set.delete(1);
console.log(set.has(2)); // true

// 数组去重（最常用）
const duplicates = [1, 1, 2, 3, 3, 4];
const unique = [...new Set(duplicates)];
console.log(unique); // [1, 2, 3, 4]

// Map —— 键可以是任意类型的"对象"
const map = new Map();
map.set("name", "Tom");
map.set(42, "数字键");
map.set(true, "布尔键");

console.log(map.get("name")); // "Tom"
console.log(map.size); // 3

// 遍历 Map
for (const [key, value] of map) {
  console.log(key, "→", value);
}

// ============================================
// 9. 解构的高级用法
// ============================================

// 函数参数解构（React 中非常常见）
function UserCard({ name, age, city = "未知" }) {
  return `${name}, ${age}岁, ${city}`;
}

console.log(UserCard({ name: "Tom", age: 22 }));
// "Tom, 22岁, 未知"

// 交换变量
let x = 1,
  y = 2;
[x, y] = [y, x];
console.log(x, y); // 2, 1

// 剩余参数
const [first, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest); // [2, 3, 4, 5]

const { name, ...otherInfo } = { name: "Tom", age: 22, city: "Beijing" };
console.log(name); // "Tom"
console.log(otherInfo); // { age: 22, city: "Beijing" }

// ============================================
// 重点总结
// ============================================
/*
模块化：
  export / export default
  import { xxx } / import xxx

安全访问：
  ?. 可选链 —— 防止访问 null/undefined 的属性报错
  ?? 空值合并 —— 只对 null/undefined 生效（比 || 更精确）

数组：
  Array.from()  —— 类数组转数组
  .flat()       —— 扁平化
  .at(-1)       —— 负索引
  [...new Set(arr)] —— 去重

对象：
  Object.fromEntries() —— 键值对转对象
  structuredClone()    —— 深拷贝

实际开发中最常用：
  - 可选链 ?.（几乎每天都用）
  - 空值合并 ??
  - 解构 + 剩余参数
  - Set 去重
  - import/export 模块化
*/