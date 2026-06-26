type FieldErrorProps = {
  message?: string
  shouldShow: boolean
}

export function FieldError({ message, shouldShow }: FieldErrorProps) {
  if (!shouldShow) {
    return null
  }

  return (
    <p className="field-error" role="alert">
      {message}
    </p>
  )
}
