import type { FormErrors, RegisterFormData } from '../types/registerForm'

export function validateRegisterForm(formData: RegisterFormData) {
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
