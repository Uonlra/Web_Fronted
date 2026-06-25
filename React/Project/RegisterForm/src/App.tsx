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

type FormErrors = Partial<Record<keyof RegisterFormData, string>>

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
  const [errors, setErrors] = useState<FormErrors>({}) // 创建一个新的状态来存储表单的错误信息，初始值为空对象

  const validateForm = () => {
    const nextErrors: FormErrors = {} // 创建一个新的错误对象，为空值

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

    const nextErrors = validateForm()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
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
            现在错误信息会显示在对应字段下面，用户能直接看到哪里需要修改。
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="username">用户名</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="请输入用户名"
              value={formData.username}
              onChange={handleChange}
              aria-invalid={Boolean(errors.username)}
            />
            {errors.username && (
              <p className="field-error" role="alert">
                {errors.username}
              </p>
            )}
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
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <p className="field-error" role="alert">
                {errors.email}
              </p>
            )}
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
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <p className="field-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="gender">性别</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              aria-invalid={Boolean(errors.gender)}
            >
              <option value="" disabled>
                请选择
              </option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
            {errors.gender && (
              <p className="field-error" role="alert">
                {errors.gender}
              </p>
            )}
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
              aria-invalid={Boolean(errors.bio)}
            />
            {errors.bio && (
              <p className="field-error" role="alert">
                {errors.bio}
              </p>
            )}
          </div>

          <div className="agreement-field">
            <label className="checkbox-field" htmlFor="agreeToTerms">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                aria-invalid={Boolean(errors.agreeToTerms)}
              />
              <span>我已阅读并同意用户协议</span>
            </label>
            {errors.agreeToTerms && (
              <p className="field-error" role="alert">
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          <button className="submit-button" type="submit">
            提交注册
          </button>
        </form>
      </section>
    </main>
  )
}

export default App
