import './App.css'

function App() {
  return (
    <main className="page-shell">
      <section className="form-panel" aria-labelledby="form-title">
        <div className="form-heading">
          <p className="eyebrow">React + TypeScript Form</p>
          <h1 id="form-title">注册资料</h1>
          <p className="description">
            先完成表单界面，下一步我们会把这些字段变成受控组件。
          </p>
        </div>

        <form className="register-form">
          <div className="form-field">
            <label htmlFor="username">用户名</label>
            <input id="username" name="username" type="text" placeholder="请输入用户名" />
          </div>

          <div className="form-field">
            <label htmlFor="email">邮箱</label>
            <input id="email" name="email" type="email" placeholder="name@example.com" />
          </div>

          <div className="form-field">
            <label htmlFor="password">密码</label>
            <input id="password" name="password" type="password" placeholder="至少 6 位" />
          </div>

          <div className="form-field">
            <label htmlFor="gender">性别</label>
            <select id="gender" name="gender" defaultValue="">
              <option value="" disabled>
                请选择
              </option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="bio">简介</label>
            <textarea id="bio" name="bio" rows={4} placeholder="简单介绍一下自己" />
          </div>

          <label className="checkbox-field" htmlFor="agreeToTerms">
            <input id="agreeToTerms" name="agreeToTerms" type="checkbox" />
            <span>我已阅读并同意用户协议</span>
          </label>

          <button className="submit-button" type="submit">
            提交注册
          </button>
        </form>
      </section>
    </main>
  )
}

export default App
