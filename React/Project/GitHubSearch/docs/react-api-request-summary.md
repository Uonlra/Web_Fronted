# React API 请求学习总结

## 代码位置和作用

### src/hooks/useGithubUser.ts

作用：管理 React 中的 API 请求状态。

它负责：

- 保存 user 数据
- 保存 loading 状态
- 保存 error 错误信息
- 发起搜索请求
- 取消旧请求
- 组件卸载时清理未完成请求

### src/services/githubApi.ts

作用：专门负责和 GitHub API 通信。

它负责：

- 调用 fetch
- 判断 response.ok
- 解析 response.json()
- 把 GitHub API 原始数据转换成前端内部数据
- 抛出错误给 Hook 层处理

### src/types/github.ts

作用：定义 API 数据类型。

它负责：

- GithubApiUser：描述 GitHub API 返回的原始字段
- GithubUser：描述前端组件内部使用的数据字段

## 1. useGithubUser 的请求流程

useGithubUser 的核心职责是：把 API 请求过程翻译成 React 可以渲染的状态。

整体流程：

```text
调用 fetchGithubUser(username)
-> trim 清理用户名
-> 如果用户名为空，直接设置 error，不发请求
-> 取消上一次未完成的请求
-> 创建新的 AbortController
-> 设置 loading = true
-> 清空 error
-> 清空旧 user
-> 调用 getGithubUser 请求 GitHub API
-> 成功：setUser(nextUser)
-> 失败：setError(error.message)
-> 如果是 AbortError：忽略
-> finally 中确认当前请求有效，再关闭 loading
```

关键点：

```ts
abortControllerRef.current?.abort();
```

开始新请求前，先取消旧请求。

```ts
const controller = new AbortController();
abortControllerRef.current = controller;
```

为当前请求创建控制器。

```ts
const nextUser = await getGithubUser(nextUsername, controller.signal);
setUser(nextUser);
```

请求成功后，把用户数据保存到 React 状态。

```ts
if (isAbortError(error)) {
  return;
}
```

取消请求不是业务错误，不显示给用户。

## 2. githubApi 的职责

service 层不负责页面，也不负责 React 状态。

它只负责一件事：请求数据并返回结果。

流程：

```text
接收 username
-> fetch GitHub API
-> 如果 response.ok 是 false，抛出 Error
-> response.json() 解析数据
-> formatGithubUser 转换字段
-> 返回 GithubUser
```

为什么要有 service 层：

```text
Hook 不直接写复杂 fetch 细节
页面不直接关心 API 地址
类型转换集中在一个地方
以后换接口时更好维护
```

## 3. loading / error / user 三状态

API 请求至少需要三个状态。

### loading

表示请求是否正在进行。

常见用途：

- 按钮显示“搜索中... ”
- 显示 loading 提示
- 防止用户误以为页面没反应

### error

表示请求失败或输入非法。

常见来源：

- 用户名为空
- 用户不存在
- 网络失败
- 接口异常

### user

表示请求成功后的数据。

状态组合：

```text
初始状态：
user = null
loading = false
error = ""

请求中：
user = null
loading = true
error = ""

请求成功：
user = GithubUser
loading = false
error = ""

请求失败：
user = null
loading = false
error = 错误信息
```

## 4. AbortController 为什么能防止旧请求污染新状态

问题场景：

```text
用户搜索 octocat
请求还没回来
用户马上搜索 gaearon
如果 octocat 后回来，可能覆盖 gaearon 的结果
```

解决方式：

```ts
abortControllerRef.current?.abort();
```

新请求开始前，取消旧请求。

```ts
signal: controller.signal
```

把取消信号交给 fetch。

```ts
if (isAbortError(error)) {
  return;
}
```

旧请求被取消后，不设置 error，也不设置 user。

```ts
if (!controller.signal.aborted && abortControllerRef.current === controller) {
  setLoading(false);
}
```

只有当前有效请求才可以关闭 loading。

核心理解：

```text
旧请求被取消后，即使它进入 catch，也不会再影响当前页面状态。
```

## 5. React API 请求标准模板

推荐结构：

```text
src/
  types/
    feature.ts
  services/
    featureApi.ts
  hooks/
    useFeature.ts
  components/
    FeatureCard.tsx
  pages/
    FeaturePage.tsx
```

### types 模板

```ts
export type ApiData = {
  id: number;
  raw_name: string;
};

export type ViewData = {
  id: number;
  name: string;
};
```

### service 模板

```ts
import type { ApiData, ViewData } from "../types/feature";

function formatData(data: ApiData): ViewData {
  return {
    id: data.id,
    name: data.raw_name,
  };
}

export async function getData(signal?: AbortSignal) {
  const response = await fetch("https://example.com/api/data", {
    signal,
  });

  if (!response.ok) {
    throw new Error("请求失败");
  }

  const data: ApiData = await response.json();
  return formatData(data);
}
```

### Hook 模板

```ts
import { useCallback, useEffect, useRef, useState } from "react";
import { getData } from "../services/featureApi";
import type { ViewData } from "../types/feature";

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export default function useFeature() {
  const [data, setData] = useState<ViewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const nextData = await getData(controller.signal);
      setData(nextData);
    } catch (error) {
      if (isAbortError(error)) {
        return;
      }

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("请求失败，请稍后再试");
      }
    } finally {
      if (!controller.signal.aborted && abortControllerRef.current === controller) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    fetchData();

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
  };
}
```

## 总结

React API 请求的核心不是 fetch 本身，而是状态管理。

要记住：

```text
service 负责请求
hook 负责状态
component 负责展示
page 负责组合
```
