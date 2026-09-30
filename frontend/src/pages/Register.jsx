function Register() {
  return (
    <main className="auth-page">
      <div className="auth-card">

        <p className="section-tag">JOIN HUSTLEHUB+</p>

        <h1>Create your account</h1>

        <p className="auth-description">
          Join HustleHub+ and start finding or offering freelance services.
        </p>

        <form className="auth-form">

          <label>Name</label>
          <input
            type="text"
            placeholder="Your name"
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
          />

          <label>Account type</label>
          <select defaultValue="client">
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>

          <button type="submit">
            Create Account
          </button>

        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </p>

      </div>
    </main>
  )
}

export default Register