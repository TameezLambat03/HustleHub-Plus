import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('client')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch(
        'https://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Registration failed'
        )
      }

      setSuccess(
        'Account created successfully! Redirecting to login...'
      )

      setTimeout(() => {
        navigate('/login')
      }, 1000)

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">

      <div className="auth-card">

        <p className="section-tag">
          JOIN HUSTLEHUB+
        </p>

        <h1>
          Create your account
        </h1>

        <p className="auth-description">
          Join HustleHub+ and start finding or offering
          freelance services.
        </p>

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        {success && (
          <p className="auth-success">
            {success}
          </p>
        )}

        <form
          className="auth-form"
          onSubmit={handleRegister}
        >

          <label htmlFor="name">
            Name
          </label>

          <input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <div className="role-selection">

            <div className="role-selection-header">
              <label>
                How will you use HustleHub+?
              </label>

              <span>
                Choose one
              </span>
            </div>

            <div className="role-options">

              <button
                type="button"
                className={`role-option ${
                  role === 'client'
                    ? 'selected'
                    : ''
                }`}
                onClick={() =>
                  setRole('client')
                }
              >
                <span className="role-icon">
                  👤
                </span>

                <span className="role-content">
                  <strong>
                    I'm a Client
                  </strong>

                  <span>
                    Find and book the services
                    you need.
                  </span>
                </span>

                <span className="role-check">
                  {role === 'client' ? '✓' : ''}
                </span>
              </button>

              <button
                type="button"
                className={`role-option ${
                  role === 'freelancer'
                    ? 'selected'
                    : ''
                }`}
                onClick={() =>
                  setRole('freelancer')
                }
              >
                <span className="role-icon">
                  ✦
                </span>

                <span className="role-content">
                  <strong>
                    I'm a Freelancer
                  </strong>

                  <span>
                    Offer your skills and earn
                    from your work.
                  </span>
                </span>

                <span className="role-check">
                  {role === 'freelancer'
                    ? '✓'
                    : ''}
                </span>
              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Creating Account...'
              : 'Create Account'}
          </button>

        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <a href="/login">
            Login
          </a>
        </p>

      </div>

    </main>
  )
}

export default Register