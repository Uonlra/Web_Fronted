type FormActionsProps = {
  isSubmitting: boolean
  onReset: () => void
}

export function FormActions({ isSubmitting, onReset }: FormActionsProps) {
  return (
    <div className="form-actions">
      <button className="reset-button" type="button" onClick={onReset} disabled={isSubmitting}>
        重置
      </button>
      <button className="submit-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? '提交中...' : '提交注册'}
      </button>
    </div>
  )
}
