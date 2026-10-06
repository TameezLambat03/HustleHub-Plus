
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Save JWT so protected API requests can use it
      localStorage.setItem('token', data.token)

      // Save user information too
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      
      navigate('/')

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        <p className="section-tag">WELCOME BACK</p>

        <h1>Login to HustleHub+</h1>

        <p className="auth-description">
          Log in to continue finding gigs and managing your hustle.
        </p>

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={handleLogin}>

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
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
