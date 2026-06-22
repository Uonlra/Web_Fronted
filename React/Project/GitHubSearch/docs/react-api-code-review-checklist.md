# React API 请求代码审核清单

## 代码位置和作用

### src/services/githubApi.ts

作用：负责真正的 API 请求。

审核时重点看：

- 是否只负责请求，不直接操作 React state
- 是否判断了 response.ok
- 是否把 response.json() 放在正确位置
- 是否把 API 原始数据转换成前端内部数据
- 是否通过 throw Error 把错误交给 Hook 层处理

### src/hooks/useGithubUser.ts

作用：负责 React 状态管理。

审核时重点看：

- 是否有 loading / error / user 三状态
- 请求开始前是否清空旧 error 和旧 user
- 请求失败时是否 setError
- 请求成功时是否 setUser
- 是否处理 AbortError
- finally 中是否避免旧请求影响新请求
- 组件卸载时是否取消未完成请求

### src/pages/GithubPage.tsx

作用：负责页面组合。

审核时重点看：

- 页面是否只组合组件，不堆复杂请求逻辑
- 是否通过 Hook 获取 user / loading / error
- 是否把状态传给展示组件

## 1. service 层审核清单

### 是否判断 response.ok

错误示例：

```ts
const response = await fetch(url);
const data = await response.json();
return data;
```

问题：

```text
404 / 500 时也可能继续解析，页面不容易知道请求失败。
```

推荐写法：

```ts
const response = await fetch(url);

if (!response.ok) {
  throw new Error("请求失败");
}

const data = await response.json();
return data;
```

### 是否区分 API 原始类型和前端使用类型

GitHub API 原始字段：

```ts
avatar_url
public_repos
```

前端内部字段：

```ts
avatarUrl
publicRepos
```

推荐做法：

```ts
function formatGithubUser(data: GithubApiUser): GithubUser {
  return {
    avatarUrl: data.avatar_url,
    publicRepos: data.public_repos,
  };
}
```

## 2. Hook 层审核清单

### 请求开始前是否设置 loading

推荐顺序：

```ts
setLoading(true);
setError("");
setUser(null);
```

意思是：

```text
进入请求中状态
清空旧错误
清空旧结果，避免用户误以为旧数据就是新搜索结果
```

### 是否处理空输入

推荐写法：

```ts
const nextUsername = rawUsername.trim();

if (nextUsername === "") {
  setError("请输入 GitHub 用户名");
  setUser(null);
  setLoading(false);
  return;
}
```

### 是否处理 AbortError

推荐写法：

```ts
if (isAbortError(error)) {
  return;
}
```

原因：

```text
AbortError 代表请求被取消，不代表请求失败。
```

### finally 是否检查当前请求仍然有效

推荐写法：

```ts
if (!controller.signal.aborted && abortControllerRef.current === controller) {
  setLoading(false);
  abortControllerRef.current = null;
}
```

原因：

```text
旧请求不能关闭新请求的 loading。
```

## 3. 常见错误

### 错误 1：忘记 async

错误写法：

```ts
function handleSearch() {
  const response = await fetch(url);
}
```

问题：

```text
await 只能写在 async 函数里。
```

正确写法：

```ts
async function handleSearch() {
  const response = await fetch(url);
}
```

### 错误 2：把 service 写成 React Hook

错误倾向：

```ts
// githubApi.ts
setLoading(true);
setUser(data);
```

问题：

```text
service 层不应该知道 React state。
```

正确分工：

```text
service 负责请求
hook 负责 setState
```

### 错误 3：取消请求后仍然显示错误

错误现象：

```text
用户快速搜索，页面显示 AbortError
```

原因：

```text
没有单独忽略 AbortError。
```

正确处理：

```ts
if (isAbortError(error)) {
  return;
}
```

### 错误 4：旧请求覆盖新请求

问题场景：

```text
先搜索 A，再搜索 B。
B 先返回，A 后返回。
如果没有取消 A，A 可能覆盖 B 的结果。
```

解决方式：

```ts
abortControllerRef.current?.abort();
```

每次新请求开始前取消旧请求。

## 4. 当前项目结构审核结论

当前结构合理：

```text
src/types/github.ts        类型定义
src/services/githubApi.ts  API 请求
src/hooks/useGithubUser.ts React 请求状态
src/components/            展示组件
src/pages/GithubPage.tsx   页面组合
```

这已经是一个小型真实项目里常见的 API 请求组织方式。

## 5. 以后写 API 请求时的自查问题

写完一个 API 请求后，问自己：

```text
1. 我有没有 loading / error / data 三状态？
2. 我有没有判断 response.ok？
3. 我有没有把 API 原始数据转换成前端数据？
4. 我有没有处理空输入？
5. 我有没有处理请求取消？
6. 我有没有避免旧请求覆盖新请求？
7. 我有没有把请求逻辑放在 service，而不是页面里？
8. 我有没有把 React 状态逻辑放在 Hook，而不是 service 里？
```

记住这句话：

```text
API 请求代码不是只要能拿到数据就结束，还要能解释请求过程中的每一种状态。
```
