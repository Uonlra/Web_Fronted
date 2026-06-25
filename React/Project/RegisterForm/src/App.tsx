import { useState } from 'react'
import './App.css'

type RegisterFormData = {
  username: string
  email: string
  password: string
  confirmPassword: string
  gender: string
  bio: string
  agreeToTerms: boolean
}

type SubmitPayload = Omit<RegisterFormData, 'confirmPassword'>
type FormErrors = Partial<Record<keyof RegisterFormData, string>>
type TouchedFields = Partial<Record<keyof RegisterFormData, boolean>>

type FormChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>

type FormBlurEvent = React.FocusEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>

const initialFormData: RegisterFormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  bio: '',
  agreeToTerms: false,
}

const formFieldOrder: Array<keyof RegisterFormData> = [
  'username',
  'email',
  'password',
  'confirmPassword',
  'gender',
  'bio',
  'agreeToTerms',
]

function App() {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<TouchedFields>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const validateForm = () => {
    const nextErrors: FormErrors = {}

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

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = '请再次输入密码'
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = '两次输入的密码不一致'
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

  const showError = (fieldName: keyof RegisterFormData) => {
    return Boolean(touched[fieldName] && errors[fieldName])
  }

  const touchAllFields = () => {
    const nextTouched: TouchedFields = {}

    for (const fieldName of formFieldOrder) {
      nextTouched[fieldName] = true
    }

    setTouched(nextTouched)
  }

  const focusFirstError = (nextErrors: FormErrors) => {
    const firstErrorField = formFieldOrder.find((fieldName) => nextErrors[fieldName])

    if (!firstErrorField) {
      return
    }

    const fieldElement = document.querySelector<HTMLElement>(`[name="${firstErrorField}"]`)
    fieldElement?.focus()
  }

  const handleBlur = (event: FormBlurEvent) => {
    const fieldName = event.target.name as keyof RegisterFormData

    setTouched((prevTouched) => ({
      ...prevTouched,
      [fieldName]: true,
    }))

    setErrors(validateForm())
  }

  const handleChange = (event: FormChangeEvent) => {
    const { name, value } = event.target
    const fieldName = name as keyof RegisterFormData

    if (submitMessage) {
      setSubmitMessage('')
    }

    if (errors[fieldName]) {
      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors }
        delete nextErrors[fieldName]
        return nextErrors
      })
    }

    if (event.target instanceof HTMLInputElement && event.target.type === 'checkbox') {
      setFormData({
        ...formData,
        [fieldName]: event.target.checked,
      })
      return
    }

    setFormData({
      ...formData,
      [fieldName]: value,
    })
  }

  const handleReset = () => {
    setFormData(initialFormData)
    setErrors({})
    setTouched({})
    setSubmitMessage('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateForm()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      touchAllFields()
      window.setTimeout(() => focusFirstError(nextErrors), 0)
      setSubmitMessage('')
      console.log('表单校验失败', nextErrors)
      return
    }

    const payload: SubmitPayload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
      bio: formData.bio,
      agreeToTerms: formData.agreeToTerms,
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    await new Promise((resolve) => {
      window.setTimeout(resolve, 1000)
    })

    console.log('提交成功', payload)
    setSubmitMessage('注册成功！')
    setIsSubmitting(false)
  }

  return (
    <main className="page-shell">
      <section className="form-panel" aria-labelledby="form-title">
        <div className="form-heading">
          <p className="eyebrow">React + TypeScript Form</p>
          <h1 id="form-title">注册资料</h1>
          <p className="description">
            字段失焦后才显示错误，提交失败时会自动定位到第一个错误字段。
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
              onBlur={handleBlur}
              aria-invalid={showError('username')}
              disabled={isSubmitting}
            />
            {showError('username') && (
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
              onBlur={handleBlur}
              aria-invalid={showError('email')}
              disabled={isSubmitting}
            />
            {showError('email') && (
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
              onBlur={handleBlur}
              aria-invalid={showError('password')}
              disabled={isSubmitting}
            />
            {showError('password') && (
              <p className="field-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={showError('confirmPassword')}
              disabled={isSubmitting}
            />
            {showError('confirmPassword') && (
              <p className="field-error" role="alert">
                {errors.confirmPassword}
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
              onBlur={handleBlur}
              aria-invalid={showError('gender')}
              disabled={isSubmitting}
            >
              <option value="" disabled>
                请选择
              </option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
            {showError('gender') && (
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
              onBlur={handleBlur}
              aria-invalid={showError('bio')}
              disabled={isSubmitting}
            />
            <p className={formData.bio.length > 100 ? 'char-count is-over' : 'char-count'}>
              {formData.bio.length} / 100
            </p>
            {showError('bio') && (
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
                onBlur={handleBlur}
                aria-invalid={showError('agreeToTerms')}
                disabled={isSubmitting}
              />
              <span>我已阅读并同意用户协议</span>
            </label>
            {showError('agreeToTerms') && (
              <p className="field-error" role="alert">
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          {submitMessage && (
            <p className="submit-message" role="status">
              {submitMessage}
            </p>
          )}

          <div className="form-actions">
            <button className="reset-button" type="button" onClick={handleReset} disabled={isSubmitting}>
              重置
            </button>
            <button className="submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? '提交中...' : '提交注册'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default App
