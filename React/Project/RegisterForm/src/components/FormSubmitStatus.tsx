type FormSubmitStatusProps = {
  submitMessage: string
  submitErrorMessage: string
}

export function FormSubmitStatus({
  submitMessage,
  submitErrorMessage,
}: FormSubmitStatusProps) {
  return (
    <>
      {submitMessage && (
        <p className="submit-message" role="status">
          {submitMessage}
        </p>
      )}

      {submitErrorMessage && (
        <p className="submit-error-message" role="alert">
          {submitErrorMessage}
        </p>
      )}
    </>
  )
}
