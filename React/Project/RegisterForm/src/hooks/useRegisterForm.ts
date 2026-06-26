import { useEffect, useRef, useState } from 'react'
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
import { createSubmitPayload, wait } from '../utils/registerFormSubmit'
import { validateRegisterForm } from '../utils/validateRegisterForm'

type UseRegisterFormOptions = {
  initialValues?: RegisterFormData
  onSubmit?: (payload: SubmitPayload) => void | Promise<void>
  onSubmitSuccess?: (payload: SubmitPayload) => void | Promise<void>
  onSubmitError?: (errors: FormErrors) => void
  onReset?: () => void
  submitDelayMs?: number
  successMessage?: string
  errorMessage?: string
}

export function useRegisterForm(options: UseRegisterFormOptions = {}) {
  const {
    initialValues = initialFormData,
    onSubmit,
    onSubmitSuccess,
    onSubmitError,
    onReset,
    submitDelayMs = 1000,
    successMessage = '注册成功！',
    errorMessage = '提交失败，请稍后再试',
  } = options

  const isMountedRef = useRef(true)
  const [formData, setFormData] = useState<RegisterFormData>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<TouchedFields>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

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

    if (submitErrorMessage) {
      setSubmitErrorMessage('')
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
    setFormData(initialValues)
    setErrors({})
    setTouched({})
    setSubmitMessage('')
    setSubmitErrorMessage('')
    onReset?.()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const nextErrors = validateRegisterForm(formData)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      touchAllFields()
      window.setTimeout(() => focusFirstError(nextErrors), 0)
      setSubmitMessage('')
      setSubmitErrorMessage('')
      onSubmitError?.(nextErrors)
      console.log('表单校验失败', nextErrors)
      return
    }

    const submitPayload = createSubmitPayload(formData)

    setIsSubmitting(true)
    setSubmitMessage('')
    setSubmitErrorMessage('')

    try {
      if (onSubmit) {
        await onSubmit(submitPayload)
      } else {
        await wait(submitDelayMs)
      }

      await onSubmitSuccess?.(submitPayload)
      console.log('提交成功', submitPayload)

      if (isMountedRef.current) {
        setSubmitMessage(successMessage)
      }
    } catch (error) {
      console.error('提交失败', error)

      if (isMountedRef.current) {
        setSubmitErrorMessage(errorMessage)
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false)
      }
    }
  }

  return {
    formData,
    isSubmitting,
    submitMessage,
    submitErrorMessage,
    getFieldError,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
  }
}
