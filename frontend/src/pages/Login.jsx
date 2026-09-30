function Login() {
  return (
    <main className="auth-page">
      <div className="auth-card">

        <p className="section-tag">WELCOME BACK</p>

        <h1>Login to HustleHub+</h1>

        <p className="auth-description">
          Log in to continue finding gigs and managing your hustle.
        </p>

        <form className="auth-form">

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account? <a href="/register">Sign up</a>
        </p>

      </div>
    </main>
  )
}

export default Login