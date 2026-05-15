// ============================================
// WeatherCard.jsx —— 天气信息展示组件
// ============================================
// 学习点：
// - 接收 props 并渲染数据
// - 条件渲染和动态 className

function WeatherCard({ weather }) {
  // 根据天气代码返回对应 emoji
  function getWeatherEmoji(code) {
    const codeNum = Number(code)
    if (codeNum === 113) return '☀️'
    if (codeNum === 116) return '⛅'
    if (codeNum === 119 || codeNum === 122) return '☁️'
    if (codeNum >= 176 && codeNum <= 299) return '🌧️'
    if (codeNum >= 300 && codeNum <= 399) return '🌨️'
    if (codeNum >= 389) return '⛈️'
    return '🌤️'
  }

  return (
    <div className="weather-card">
      <div className="weather-header">
        <span className="weather-emoji">
          {getWeatherEmoji(weather.icon)}
        </span>
        <div>
          <h2 className="weather-city">{weather.city}</h2>
          <p className="weather-desc">{weather.description}</p>
        </div>
      </div>

      <div className="weather-temp">
        {weather.temp}°C
      </div>

      {/* 列表渲染：用数组 + map 生成多个元素 */}
      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">体感温度</span>
          <span className="detail-value">{weather.feelsLike}°C</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">湿度</span>
          <span className="detail-value">{weather.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">风速</span>
          <span className="detail-value">{weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
