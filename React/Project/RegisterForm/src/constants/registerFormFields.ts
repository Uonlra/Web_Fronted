import type { FormFieldName } from '../types/registerForm'

export type TextFieldConfig = {
  name: Extract<FormFieldName, 'username' | 'email' | 'password' | 'confirmPassword'>
  label: string
  type: 'text' | 'email' | 'password'
  placeholder: string
}

export const textFields: TextFieldConfig[] = [
  {
    name: 'username',
    label: '用户名',
    type: 'text',
    placeholder: '请输入用户名',
  },
  {
    name: 'email',
    label: '邮箱',
    type: 'email',
    placeholder: 'name@example.com',
  },
  {
    name: 'password',
    label: '密码',
    type: 'password',
    placeholder: '至少 6 位',
  },
  {
    name: 'confirmPassword',
    label: '确认密码',
    type: 'password',
    placeholder: '请再次输入密码',
  },
]
