import './App.css'
import { RegisterForm } from './components/RegisterForm'
import type { FormErrors, SubmitPayload } from './types/registerForm'

function App() {
  const handleRegisterSuccess = (payload: SubmitPayload) => {
    console.log('App 收到注册成功数据', payload)
  }

  const handleRegisterError = (errors: FormErrors) => {
    console.log('App 收到注册失败错误', errors)
  }

  const handleRegisterReset = () => {
    console.log('App 收到表单重置事件')
  }

  return (
    <main className="page-shell">
      <section className="form-panel" aria-labelledby="form-title">
        <div className="form-heading">
          <p className="eyebrow">React + TypeScript Form</p>
          <h1 id="form-title">注册资料</h1>
          <p className="description" id="form-description">
            useRegisterForm 现在支持成功、失败和重置回调，页面可以订阅表单关键事件。
          </p>
        </div>

        <RegisterForm
          descriptionId="form-description"
          onSubmitSuccess={handleRegisterSuccess}
          onSubmitError={handleRegisterError}
          onReset={handleRegisterReset}
          submitDelayMs={1000}
          successMessage="注册成功！"
        />
      </section>
    </main>
  )
}

export default App
