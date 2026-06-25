import './App.css'
import { RegisterForm } from './components/RegisterForm'

function App() {
  return (
    <main className="page-shell">
      <section className="form-panel" aria-labelledby="form-title">
        <div className="form-heading">
          <p className="eyebrow">React + TypeScript Form</p>
          <h1 id="form-title">注册资料</h1>
          <p className="description" id="form-description">
            注册表单逻辑已经拆成组件、类型、常量和校验工具，更接近真实项目结构。
          </p>
        </div>

        <RegisterForm descriptionId="form-description" />
      </section>
    </main>
  )
}

export default App
