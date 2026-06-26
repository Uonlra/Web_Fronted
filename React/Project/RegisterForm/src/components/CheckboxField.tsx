import type { FieldErrorState, FormFieldEventHandlers } from '../types/registerForm'
import { FieldError } from './FieldError'

type CheckboxFieldProps = FormFieldEventHandlers & {
  id: string
  name: string
  label: string
  checked: boolean
  disabled: boolean
  error: FieldErrorState
}

export function CheckboxField({
  id,
  name,
  label,
  checked,
  disabled,
  error,
  onChange,
  onBlur,
}: CheckboxFieldProps) {
  return (
    <div className="agreement-field">
      <label className="checkbox-field" htmlFor={id}>
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={error.shouldShow}
          disabled={disabled}
        />
        <span>{label}</span>
      </label>
      <FieldError message={error.message} shouldShow={error.shouldShow} />
    </div>
  )
}
