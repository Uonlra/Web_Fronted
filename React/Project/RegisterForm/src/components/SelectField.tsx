import type { FieldErrorState, FormFieldEventHandlers } from '../types/registerForm'
import { FieldError } from './FieldError'

type SelectOption = {
  label: string
  value: string
}

type SelectFieldProps = FormFieldEventHandlers & {
  id: string
  name: string
  label: string
  value: string
  options: readonly SelectOption[]
  disabled: boolean
  error: FieldErrorState
}

export function SelectField({
  id,
  name,
  label,
  value,
  options,
  disabled,
  error,
  onChange,
  onBlur,
}: SelectFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={error.shouldShow}
        disabled={disabled}
      >
        <option value="" disabled>
          请选择
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError message={error.message} shouldShow={error.shouldShow} />
    </div>
  )
}
