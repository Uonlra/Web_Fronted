// ============================================
// 异步编程三种方式：回调、Promise、async/await
// 用 setTimeout 模拟网络请求延迟
// ============================================

// 模拟的用户数据库
const usersDB = [
  { id: 1, name: "Tom", age: 22, city: "Beijing" },
  { id: 2, name: "Alice", age: 25, city: "Shanghai" },
  { id: 3, name: "Jack", age: 20, city: "Shenzhen" },
];

// ============================================
// 方式一：回调函数 (Callback)
// ============================================
// 最早的异步处理方式
// 问题：多层嵌套会形成"回调地狱"

function getUserByCallback(id, onSuccess, onError) {
  console.log(`[回调] 正在请求用户 ${id} 的数据...`);

  setTimeout(() => {
    const user = usersDB.find((u) => u.id === id);

    if (user) {
      onSuccess(user); // 成功时调用 onSuccess
    } else {
      onError(`用户 ${id} 不存在`); // 失败时调用 onError
    }
  }, 1000); // 模拟 1 秒网络延迟
}

// 使用回调
getUserByCallback(
  1,
  (user) => {
    console.log("[回调] 成功:", user);
  },
  (error) => {
    console.log("[回调] 失败:", error);
  }
);

// 回调地狱示例 —— 如果要先获取用户，再获取用户的订单，再获取订单详情：
// getUserByCallback(1, (user) => {
//   getOrderByCallback(user.id, (order) => {
//     getOrderDetailByCallback(order.id, (detail) => {
//       // 嵌套越来越深，代码难以维护
//     }, errorHandler);
//   }, errorHandler);
// }, errorHandler);

// ============================================
// 方式二：Promise
// ============================================
// Promise 解决了回调地狱，用 .then() 链式调用
// 三种状态：pending（等待中）、fulfilled（成功）、rejected（失败）

function getUserByPromise(id) {
  console.log(`[Promise] 正在请求用户 ${id} 的数据...`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = usersDB.find((u) => u.id === id);

      if (user) {
        resolve(user); // 成功 → 触发 .then()
      } else {
        reject(`用户 ${id} 不存在`); // 失败 → 触发 .catch()
      }
    }, 1000);
  });
}

// 使用 Promise
getUserByPromise(2)
  .then((user) => {
    console.log("[Promise] 成功:", user);
  })
  .catch((error) => {
    console.log("[Promise] 失败:", error);
  });

// Promise 链式调用 —— 避免了回调地狱
// getUserByPromise(1)
//   .then(user => getOrderByPromise(user.id))
//   .then(order => getOrderDetailByPromise(order.id))
//   .then(detail => console.log(detail))
//   .catch(error => console.log(error));

// ============================================
// 方式三：async/await
// ============================================
// async/await 是 Promise 的语法糖
// 让异步代码看起来像同步代码，最易读

async function getUserByAsync(id) {
  console.log(`[async/await] 正在请求用户 ${id} 的数据...`);

  try {
    const user = await getUserByPromise(id); // await 等待 Promise 完成
    console.log("[async/await] 成功:", user);
    return user;
  } catch (error) {
    console.log("[async/await] 失败:", error);
  }
}

// 使用 async/await
getUserByAsync(3);

// 请求不存在的用户（测试错误处理）
// getUserByAsync(99);

// ============================================
// 三种方式对比
// ============================================
/*
┌─────────────┬──────────────────────────────────────┐
│   方式       │  特点                                 │
├─────────────┼──────────────────────────────────────┤
│ 回调         │ 最基础，容易形成回调地狱               │
│ Promise     │ 链式调用，解决嵌套问题                  │
│ async/await │ 最直观，像写同步代码一样写异步           │
└─────────────┴──────────────────────────────────────┘

实际开发中：
- 新代码优先用 async/await
- 理解 Promise 是基础（async/await 底层就是 Promise）
- 回调在老代码和 Node.js API 中还会遇到
*/

// ============================================
// 实战：模拟 fetch API 请求
// ============================================

function fakeFetch(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url === "/api/users") {
        resolve({
          status: 200,
          data: usersDB,
        });
      } else {
        reject({ status: 404, message: "Not Found" });
      }
    }, 800);
  });
}

// 用 async/await 调用 fakeFetch
async function loadUsers() {
  try {
    console.log("\n[fakeFetch] 加载用户列表...");
    const response = await fakeFetch("/api/users");
    console.log("[fakeFetch] 状态码:", response.status);
    console.log("[fakeFetch] 数据:", response.data);
  } catch (error) {
    console.log("[fakeFetch] 请求失败:", error.message);
  }
}

// 延迟执行，避免和上面的输出混在一起
setTimeout(() => {
  loadUsers();
}, 3000);
