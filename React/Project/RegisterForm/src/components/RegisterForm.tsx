import { useState } from 'react'
import { formFieldNames, genderOptions, initialFormData } from '../constants/registerForm'
import type {
  FormBlurEvent,
  FormChangeEvent,
  FormErrors,
  FormFieldName,
  RegisterFormData,
  SubmitPayload,
  TouchedFields,
} from '../types/registerForm'
import { validateRegisterForm } from '../utils/validateRegisterForm'

type RegisterFormProps = {
  descriptionId?: string
}

export function RegisterForm({ descriptionId }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<TouchedFields>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const getFieldError = (fieldName: FormFieldName) => {
    const message = errors[fieldName]
    const shouldShow = Boolean(touched[fieldName] && message)

    return { message, shouldShow }
  }

  const renderFieldError = (fieldName: FormFieldName) => {
    const fieldError = getFieldError(fieldName)

    if (!fieldError.shouldShow) {
      return null
    }

    return (
      <p className="field-error" role="alert">
        {fieldError.message}
      </p>
    )
  }

  const touchAllFields = () => {
    const nextTouched: TouchedFields = {}

    for (const fieldName of formFieldNames) {
      nextTouched[fieldName] = true
    }

    setTouched(nextTouched)
  }

  const focusFirstError = (nextErrors: FormErrors) => {
    const firstErrorField = formFieldNames.find((fieldName) => nextErrors[fieldName])

    if (!firstErrorField) {
      return
    }

    const fieldElement = document.querySelector<HTMLElement>(`[name="${firstErrorField}"]`)
    fieldElement?.focus()
  }

  const handleBlur = (event: FormBlurEvent) => {
    const fieldName = event.target.name as FormFieldName

    setTouched((prevTouched) => ({
      ...prevTouched,
      [fieldName]: true,
    }))

    setErrors(validateRegisterForm(formData))
  }

  const handleChange = (event: FormChangeEvent) => {
    const { name, value } = event.target
    const fieldName = name as FormFieldName

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

    const nextErrors = validateRegisterForm(formData)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      touchAllFields()
      window.setTimeout(() => focusFirstError(nextErrors), 0)
      setSubmitMessage('')
      console.log('表单校验失败', nextErrors)
      return
    }

    const { confirmPassword: _confirmPassword, ...payload }: RegisterFormData = formData
    void _confirmPassword

    setIsSubmitting(true)
    setSubmitMessage('')

    await new Promise((resolve) => {
      window.setTimeout(resolve, 1000)
    })

    console.log('提交成功', payload satisfies SubmitPayload)
    setSubmitMessage('注册成功！')
    setIsSubmitting(false)
  }

  return (
    <form className="register-form" onSubmit={handleSubmit} aria-describedby={descriptionId} noValidate>
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
          aria-invalid={getFieldError('username').shouldShow}
          disabled={isSubmitting}
        />
        {renderFieldError('username')}
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
          aria-invalid={getFieldError('email').shouldShow}
          disabled={isSubmitting}
        />
        {renderFieldError('email')}
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
          aria-invalid={getFieldError('password').shouldShow}
          disabled={isSubmitting}
        />
        {renderFieldError('password')}
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
          aria-invalid={getFieldError('confirmPassword').shouldShow}
          disabled={isSubmitting}
        />
        {renderFieldError('confirmPassword')}
      </div>

      <div className="form-field">
        <label htmlFor="gender">性别</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={getFieldError('gender').shouldShow}
          disabled={isSubmitting}
        >
          <option value="" disabled>
            请选择
          </option>
          {genderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {renderFieldError('gender')}
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
          aria-invalid={getFieldError('bio').shouldShow}
          disabled={isSubmitting}
        />
        <p className={formData.bio.length > 100 ? 'char-count is-over' : 'char-count'}>
          {formData.bio.length} / 100
        </p>
        {renderFieldError('bio')}
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
            aria-invalid={getFieldError('agreeToTerms').shouldShow}
            disabled={isSubmitting}
          />
          <span>我已阅读并同意用户协议</span>
        </label>
        {renderFieldError('agreeToTerms')}
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
  )
}
