import { genderOptions } from '../constants/registerForm'
import { textFields } from '../constants/registerFormFields'
import { useRegisterForm } from '../hooks/useRegisterForm'
import type { FormErrors, RegisterFormData, SubmitPayload } from '../types/registerForm'
import { CheckboxField } from './CheckboxField'
import { SelectField } from './SelectField'
import { TextareaField } from './TextareaField'
import { TextInputField } from './TextInputField'

type RegisterFormProps = {
  descriptionId?: string
  initialValues?: RegisterFormData
  onSubmit?: (payload: SubmitPayload) => void | Promise<void>
  onSubmitSuccess?: (payload: SubmitPayload) => void | Promise<void>
  onSubmitError?: (errors: FormErrors) => void
  onReset?: () => void
  submitDelayMs?: number
  successMessage?: string
  errorMessage?: string
}

export function RegisterForm({
  descriptionId,
  initialValues,
  onSubmit,
  onSubmitSuccess,
  onSubmitError,
  onReset,
  submitDelayMs,
  successMessage,
  errorMessage,
}: RegisterFormProps) {
  const {
    formData,
    isSubmitting,
    submitMessage,
    submitErrorMessage,
    getFieldError,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
  } = useRegisterForm({
    initialValues,
    onSubmit,
    onSubmitSuccess,
    onSubmitError,
    onReset,
    submitDelayMs,
    successMessage,
    errorMessage,
  })

  return (
    <form className="register-form" onSubmit={handleSubmit} aria-describedby={descriptionId} noValidate>
      {textFields.map((field) => (
        <TextInputField
          key={field.name}
          field={field}
          value={formData[field.name]}
          disabled={isSubmitting}
          error={getFieldError(field.name)}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      ))}

      <SelectField
        id="gender"
        name="gender"
        label="性别"
        value={formData.gender}
        options={genderOptions}
        disabled={isSubmitting}
        error={getFieldError('gender')}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <TextareaField
        id="bio"
        name="bio"
        label="简介"
        value={formData.bio}
        rows={4}
        placeholder="简单介绍一下自己"
        maxLength={100}
        disabled={isSubmitting}
        error={getFieldError('bio')}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <CheckboxField
        id="agreeToTerms"
        name="agreeToTerms"
        label="我已阅读并同意用户协议"
        checked={formData.agreeToTerms}
        disabled={isSubmitting}
        error={getFieldError('agreeToTerms')}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      {submitMessage && (
        <p className="submit-message" role="status">
          {submitMessage}
        </p>
      )}

      {submitErrorMessage && (
        <p className="submit-error-message" role="alert">
          {submitErrorMessage}
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
