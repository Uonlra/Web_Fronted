// ============================================
// App.jsx —— 天气查询应用主组件
// ============================================
// 这个文件你会学到：
// 1. useState —— 管理组件状态（输入值、天气数据、加载状态）
// 2. useEffect —— 副作用处理（组件加载时获取默认城市天气）
// 3. fetch API —— 发送网络请求获取天气数据
// 4. 条件渲染 —— 根据状态显示不同内容
// 5. 事件处理 —— 处理用户输入和按钮点击
// 6. 组件拆分 —— 把 UI 拆成小组件

import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar.jsx'
import WeatherCard from './components/WeatherCard.jsx'
import SearchHistory from './components/SearchHistory.jsx'
import './index.css'

// ============================================
// API 配置
// ============================================
// 使用 wttr.in 免费天气 API（无需注册 API Key）
const API_BASE = 'https://wttr.in'

function App() {
  // ============================================
  // useState —— 声明状态变量
  // ============================================
  // 语法：const [状态值, 修改函数] = useState(初始值)
  // 每次调用修改函数，组件会重新渲染

  const [city, setCity] = useState('')           // 输入框的值
  const [weather, setWeather] = useState(null)   // 天气数据
  const [loading, setLoading] = useState(false)  // 是否正在加载
  const [error, setError] = useState('')         // 错误信息
  const [history, setHistory] = useState([])     // 搜索历史

  // ============================================
  // useEffect —— 副作用（组件挂载时执行）
  // ============================================
  // 语法：useEffect(回调函数, 依赖数组)
  // 依赖数组为 [] 时，只在组件首次渲染后执行一次
  // 类似于"页面加载完成后做某事"

  useEffect(() => {
    // 页面加载时，默认查询北京天气
    fetchWeather('Beijing')
  }, []) // [] 表示只执行一次

  // ============================================
  // 核心函数：获取天气数据
  // ============================================
  async function fetchWeather(searchCity) {
    if (!searchCity.trim()) return

    setLoading(true)   // 开始加载
    setError('')       // 清除之前的错误

    try {
      // fetch 发送 GET 请求
      const response = await fetch(
        `${API_BASE}/${encodeURIComponent(searchCity)}?format=j1`
      )

      if (!response.ok) {
        throw new Error('城市未找到')
      }

      const data = await response.json()

      // 提取需要的天气信息
      const weatherData = {
        city: searchCity,
        temp: data.current_condition[0].temp_C,
        feelsLike: data.current_condition[0].FeelsLikeC,
        humidity: data.current_condition[0].humidity,
        description: data.current_condition[0].weatherDesc[0].value,
        windSpeed: data.current_condition[0].windspeedKmph,
        icon: data.current_condition[0].weatherCode,
      }

      setWeather(weatherData)  // 更新天气数据

      // 添加到搜索历史（去重，最多保留 5 条）
      setHistory(prev => {
        const filtered = prev.filter(item => item !== searchCity)
        return [searchCity, ...filtered].slice(0, 5)
      })

    } catch (err) {
      setError(err.message || '获取天气失败，请检查城市名称')
      setWeather(null)
    } finally {
      setLoading(false)  // 无论成功失败，结束加载状态
    }
  }

  // ============================================
  // 事件处理函数
  // ============================================
  function handleSearch() {
    fetchWeather(city)
  }

  function handleHistoryClick(historyCity) {
    setCity(historyCity)
    fetchWeather(historyCity)
  }

  // ============================================
  // JSX 渲染
  // ============================================
  // JSX = JavaScript + XML，React 用它来描述 UI
  // 看起来像 HTML，但其实是 JS 表达式

  return (
    <div className="app">
      <h1 className="app-title">天气查询</h1>

      {/* 搜索栏组件 —— 通过 props 传递数据和函数 */}
      <SearchBar
        city={city}
        setCity={setCity}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* 搜索历史组件 */}
      {history.length > 0 && (
        <SearchHistory
          history={history}
          onHistoryClick={handleHistoryClick}
        />
      )}

      {/* 条件渲染：根据状态显示不同内容 */}
      {loading && <p className="status-text">加载中...</p>}
      {error && <p className="error-text">{error}</p>}
      {weather && !loading && <WeatherCard weather={weather} />}
    </div>
  )
}

// 默认导出 —— 其他文件可以 import App from './App'
export default App
