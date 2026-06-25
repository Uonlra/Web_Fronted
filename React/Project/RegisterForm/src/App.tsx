import { useState } from 'react'
import './App.css'

type RegisterFormData = {
  username: string
  email: string
  password: string
  gender: string
  bio: string
  agreeToTerms: boolean
}

type FormChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>

function App() {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    gender: '',
    bio: '',
    agreeToTerms: false,
  })

  const handleChange = (event: FormChangeEvent) => {
    const { name, value } = event.target

    if (event.target instanceof HTMLInputElement && event.target.type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: event.target.checked,
      })
      return
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <main className="page-shell">
      <section className="form-panel" aria-labelledby="form-title">
        <div className="form-heading">
          <p className="eyebrow">React + TypeScript Form</p>
          <h1 id="form-title">注册资料</h1>
          <p className="description">
            现在使用统一的 handleChange 处理不同表单控件的输入变化。
          </p>
        </div>

        <form className="register-form">
          <div className="form-field">
            <label htmlFor="username">用户名</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="请输入用户名"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">邮箱</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">密码</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="至少 6 位"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="gender">性别</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>
                请选择
              </option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="bio">简介</label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              placeholder="简单介绍一下自己"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <label className="checkbox-field" htmlFor="agreeToTerms">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <span>我已阅读并同意用户协议</span>
          </label>

          <button className="submit-button" type="submit">
            提交注册
          </button>
        </form>
      </section>
    </main>
  )
}

export default App
