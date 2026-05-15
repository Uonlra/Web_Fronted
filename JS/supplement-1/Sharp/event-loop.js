// ============================================
// 事件循环（Event Loop）和异步进阶
// 面试高频：输出顺序题
// ============================================

// ============================================
// 1. JS 是单线程的
// ============================================

// JS 只有一个主线程执行代码
// 但通过事件循环机制，可以处理异步操作（网络请求、定时器等）
// 异步操作不会阻塞主线程

// ============================================
// 2. 执行顺序：同步 > 微任务 > 宏任务
// ============================================

// 同步代码：立即执行
// 微任务（Microtask）：Promise.then/catch/finally、queueMicrotask
// 宏任务（Macrotask）：setTimeout、setInterval、DOM 事件

console.log("1. 同步代码");

setTimeout(() => {
  console.log("2. 宏任务 - setTimeout"); // 宏任务是指定时器回调，放在宏任务队列里，等同步代码和微任务执行完才执行
}, 0);

Promise.resolve().then(() => {
  console.log("3. 微任务 - Promise.then");
});

console.log("4. 同步代码");

// 输出顺序：1 → 4 → 3 → 2
// 解释：
// 1. 先执行所有同步代码（1, 4）
// 2. 同步代码执行完，检查微任务队列（3）
// 3. 微任务清空后，执行下一个宏任务（2）

// ============================================
// 3. 经典面试题
// ============================================

// 题目 1：基础输出顺序
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("C");
  })
  .then(() => {
    console.log("D");
  });

console.log("E");

// 答案：A → E → C → D → B
// A, E 是同步；C, D 是微任务（按顺序）；B 是宏任务

// 题目 2：async/await 的执行顺序
async function asyncFn() {
  console.log("async 开始"); // 同步执行
  await Promise.resolve();
  console.log("await 之后"); // 相当于放进微任务队列
}

console.log("脚本开始");
asyncFn();
console.log("脚本结束");

// 答案：脚本开始 → async 开始 → 脚本结束 → await 之后
// 关键：await 之后的代码相当于 .then() 里的回调

// 题目 3：setTimeout 嵌套 Promise
setTimeout(() => {
  console.log("timeout 1");
  Promise.resolve().then(() => {
    console.log("promise in timeout");
  });
}, 0);

setTimeout(() => {
  console.log("timeout 2");
}, 0);

Promise.resolve().then(() => {
  console.log("promise 1");
});

// 答案：promise 1 → timeout 1 → promise in timeout → timeout 2
// 解释：
// 1. 微任务先执行：promise 1
// 2. 第一个宏任务：timeout 1，执行后产生新微任务
// 3. 清空微任务：promise in timeout
// 4. 第二个宏任务：timeout 2

// ============================================
// 4. Promise 进阶用法
// ============================================

// Promise.all —— 所有都成功才成功
const p1 = fetch("/api/user");
const p2 = fetch("/api/posts");
const p3 = fetch("/api/comments");

// 并行请求，全部完成后统一处理
// Promise.all([p1, p2, p3])
//   .then(([user, posts, comments]) => {
//     console.log("全部加载完成");
//   })
//   .catch((error) => {
//     console.log("有一个失败了:", error);
//   });

// Promise.allSettled —— 不管成功失败，等所有都结束
// Promise.allSettled([p1, p2, p3]).then((results) => {
//   results.forEach((result) => {
//     if (result.status === "fulfilled") {
//       console.log("成功:", result.value);
//     } else {
//       console.log("失败:", result.reason);
//     }
//   });
// });

// Promise.race —— 谁先完成用谁的结果（不管成功失败）
// 常用于超时控制
function fetchWithTimeout(url, timeout = 5000) {
  const fetchPromise = fetch(url);
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("请求超时")), timeout);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
}

// Promise.any —— 谁先成功用谁（忽略失败的）
// 常用于多个备用源
// Promise.any([
//   fetch("https://cdn1.example.com/data"),
//   fetch("https://cdn2.example.com/data"),
//   fetch("https://cdn3.example.com/data"),
// ]).then((fastest) => {
//   console.log("最快的成功响应:", fastest);
// });

// ============================================
// 5. 手写 Promise（简化版）—— 加分项
// ============================================

class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.callbacks = [];

    const resolve = (value) => {
      if (this.state !== "pending") return;
      this.state = "fulfilled";
      this.value = value;
      this.callbacks.forEach((cb) => cb.onFulfilled(value));
    };

    const reject = (reason) => {
      if (this.state !== "pending") return;
      this.state = "rejected";
      this.value = reason;
      this.callbacks.forEach((cb) => cb.onRejected(reason));
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === "fulfilled") {
      onFulfilled(this.value);
    } else if (this.state === "rejected") {
      onRejected(this.value);
    } else {
      this.callbacks.push({ onFulfilled, onRejected });
    }
    return this; // 简化版，支持链式调用
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}

// 测试手写 Promise
const myP = new MyPromise((resolve, reject) => {
  setTimeout(() => resolve("手写 Promise 成功！"), 500);
});

myP.then((value) => {
  console.log(value); // "手写 Promise 成功！"
});

// ============================================
// 重点总结
// ============================================
/*
事件循环执行顺序：
  1. 执行所有同步代码
  2. 清空微任务队列（Promise.then、async/await 后面的代码）
  3. 执行一个宏任务（setTimeout、setInterval）
  4. 重复 2-3

记忆口诀：同步 → 微任务 → 宏任务

async/await 关键点：
  - async 函数内，await 之前的代码是同步执行的
  - await 之后的代码相当于放进 .then() 里（微任务）

Promise 静态方法：
  - Promise.all      —— 全部成功才成功
  - Promise.allSettled —— 等所有结束（不管成败）
  - Promise.race     —— 谁先完成用谁
  - Promise.any      —— 谁先成功用谁

面试常考：
  - 输出顺序题（setTimeout + Promise + 同步代码）
  - 手写简易 Promise
  - Promise.all 的使用场景
*/