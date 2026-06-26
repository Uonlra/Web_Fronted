import type { formFieldNames, genderOptions } from '../constants/registerForm'

export type FormFieldName = (typeof formFieldNames)[number]
export type Gender = (typeof genderOptions)[number]['value']

export type RegisterFormData = {
  username: string
  email: string
  password: string
  confirmPassword: string
  gender: '' | Gender
  bio: string
  agreeToTerms: boolean
}

export type SubmitPayload = Omit<RegisterFormData, 'confirmPassword'>
export type FormErrors = Partial<Record<FormFieldName, string>>
export type TouchedFields = Partial<Record<FormFieldName, boolean>>

export type FormChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>

export type FormBlurEvent = React.FocusEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>

export type FieldErrorState = {
  message?: string
  shouldShow: boolean
}

export type FormFieldEventHandlers = {
  onChange: (event: FormChangeEvent) => void
  onBlur: (event: FormBlurEvent) => void
}
