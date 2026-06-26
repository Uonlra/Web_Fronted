import type { RegisterFormData, SubmitPayload } from '../types/registerForm'

export function wait(delayMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs)
  })
}

export function createSubmitPayload(formData: RegisterFormData): SubmitPayload {
  const { confirmPassword: _confirmPassword, ...payload } = formData
  void _confirmPassword

  return payload
}
