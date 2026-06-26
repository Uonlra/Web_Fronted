import './App.css'
import { RegisterForm } from './components/RegisterForm'
import type { FormErrors, SubmitPayload } from './types/registerForm'

function App() {
  const handleSubmitRegister = async (payload: SubmitPayload) => {
    console.log('模拟接口提交注册数据', payload)

    await new Promise((resolve) => {
      window.setTimeout(resolve, 1000)
    })
  }

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
            useRegisterForm 现在支持真实提交函数、初始值和提交失败提示。
          </p>
        </div>

        <RegisterForm
          descriptionId="form-description"
          onSubmit={handleSubmitRegister}
          onSubmitSuccess={handleRegisterSuccess}
          onSubmitError={handleRegisterError}
          onReset={handleRegisterReset}
          successMessage="注册成功！"
          errorMessage="注册提交失败，请稍后再试"
        />
      </section>
    </main>
  )
}

export default App
