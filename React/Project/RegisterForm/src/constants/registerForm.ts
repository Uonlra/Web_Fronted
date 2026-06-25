import type { RegisterFormData } from '../types/registerForm'

export const formFieldNames = [
  'username',
  'email',
  'password',
  'confirmPassword',
  'gender',
  'bio',
  'agreeToTerms',
] as const

export const genderOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '其他', value: 'other' },
] as const

export const initialFormData: RegisterFormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  bio: '',
  agreeToTerms: false,
}
