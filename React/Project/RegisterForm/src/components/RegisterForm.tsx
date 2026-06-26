import { genderOptions } from '../constants/registerForm'
import { useRegisterForm } from '../hooks/useRegisterForm'
import type { FormErrors, FormFieldName, SubmitPayload } from '../types/registerForm'

type RegisterFormProps = {
  descriptionId?: string
  onSubmitSuccess?: (payload: SubmitPayload) => void | Promise<void>
  onSubmitError?: (errors: FormErrors) => void
  onReset?: () => void
  submitDelayMs?: number
  successMessage?: string
}

export function RegisterForm({
  descriptionId,
  onSubmitSuccess,
  onSubmitError,
  onReset,
  submitDelayMs,
  successMessage,
}: RegisterFormProps) {
  const {
    formData,
    isSubmitting,
    submitMessage,
    getFieldError,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
  } = useRegisterForm({
    onSubmitSuccess,
    onSubmitError,
    onReset,
    submitDelayMs,
    successMessage,
  })

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
