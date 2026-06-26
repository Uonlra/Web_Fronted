import type { TextFieldConfig } from '../constants/registerFormFields'
import type { FieldErrorState, FormFieldEventHandlers } from '../types/registerForm'
import { FieldError } from './FieldError'

type TextInputFieldProps = FormFieldEventHandlers & {
  field: TextFieldConfig
  value: string
  disabled: boolean
  error: FieldErrorState
}

export function TextInputField({
  field,
  value,
  disabled,
  error,
  onChange,
  onBlur,
}: TextInputFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={field.name}>{field.label}</label>
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        placeholder={field.placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={error.shouldShow}
        disabled={disabled}
      />
      <FieldError message={error.message} shouldShow={error.shouldShow} />
    </div>
  )
}
