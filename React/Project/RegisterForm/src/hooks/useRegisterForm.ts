import { useState } from 'react'
import { formFieldNames, initialFormData } from '../constants/registerForm'
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

type UseRegisterFormOptions = {
  onSubmitSuccess?: (payload: SubmitPayload) => void | Promise<void>
  onSubmitError?: (errors: FormErrors) => void
  onReset?: () => void
  submitDelayMs?: number
  successMessage?: string
}

export function useRegisterForm(options: UseRegisterFormOptions = {}) {
  const {
    onSubmitSuccess,
    onSubmitError,
    onReset,
    submitDelayMs = 1000,
    successMessage = '注册成功！',
  } = options

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
    onReset?.()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateRegisterForm(formData)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      touchAllFields()
      window.setTimeout(() => focusFirstError(nextErrors), 0)
      setSubmitMessage('')
      onSubmitError?.(nextErrors)
      console.log('表单校验失败', nextErrors)
      return
    }

    const { confirmPassword: _confirmPassword, ...payload }: RegisterFormData = formData
    void _confirmPassword
    const submitPayload = payload satisfies SubmitPayload

    setIsSubmitting(true)
    setSubmitMessage('')

    await new Promise((resolve) => {
      window.setTimeout(resolve, submitDelayMs)
    })

    await onSubmitSuccess?.(submitPayload)
    console.log('提交成功', submitPayload)
    setSubmitMessage(successMessage)
    setIsSubmitting(false)
  }

  return {
    formData,
    isSubmitting,
    submitMessage,
    getFieldError,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
  }
}
