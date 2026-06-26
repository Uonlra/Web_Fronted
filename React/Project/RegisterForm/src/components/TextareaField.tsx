import type { FieldErrorState, FormFieldEventHandlers } from '../types/registerForm'
import { FieldError } from './FieldError'

type TextareaFieldProps = FormFieldEventHandlers & {
  id: string
  name: string
  label: string
  value: string
  rows: number
  placeholder: string
  maxLength: number
  disabled: boolean
  error: FieldErrorState
}

export function TextareaField({
  id,
  name,
  label,
  value,
  rows,
  placeholder,
  maxLength,
  disabled,
  error,
  onChange,
  onBlur,
}: TextareaFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={error.shouldShow}
        disabled={disabled}
      />
      <p className={value.length > maxLength ? 'char-count is-over' : 'char-count'}>
        {value.length} / {maxLength}
      </p>
      <FieldError message={error.message} shouldShow={error.shouldShow} />
    </div>
  )
}
