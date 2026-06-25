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

type FormErrors = Partial<Record<keyof RegisterFormData, string>> //错误对象的 key 必须来自 RegisterFormData

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

  const [, setErrors] = useState<FormErrors>({})

  const validateForm = () => {
    const nextErrors: FormErrors = {} // 创建一个空的错误对象nextErrors,FormErrors类型，表示表单字段的错误信息。它是一个可选的对象，键是RegisterFormData的属性名，值是字符串类型的错误信息。

    if (formData.username.trim().length < 2) {
      nextErrors.username = '用户名至少需要 2 个字符'
    }

    if (!formData.email.trim()) {
      nextErrors.email = '请输入邮箱'
    } else if (!formData.email.includes('@')) {
      nextErrors.email = '邮箱格式需要包含 @'
    }

    if (formData.password.length < 6) {
      nextErrors.password = '密码至少需要 6 位'
    }

    if (!formData.gender) {
      nextErrors.gender = '请选择性别'
    }

    if (formData.bio.length > 100) {
      nextErrors.bio = '简介不能超过 100 个字符'
    }

    if (!formData.agreeToTerms) {
      nextErrors.agreeToTerms = '请先同意用户协议'
    }

    return nextErrors
  }

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateForm() // 调用 validateForm 函数进行表单验证，返回一个包含错误信息的对象 nextErrors。这个对象的键是表单字段的名称，值是对应的错误信息字符串。如果某个字段没有错误，则不会在 nextErrors 中包含该字段。
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) { //object.keys(nextErrors).length > 0 表示如果 nextErrors 对象中有任何属性（即存在错误），则执行以下代码块。
      console.log('表单校验失败', nextErrors)
      return
    }

    console.log('提交表单数据', formData)
  }

  return (
    <main className="page-shell">
      <section className="form-panel" aria-labelledby="form-title">
        <div className="form-heading">
          <p className="eyebrow">React + TypeScript Form</p>
          <h1 id="form-title">注册资料</h1>
          <p className="description">
            现在提交时会先做基础校验，下一步再把错误显示到字段下面。
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
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
