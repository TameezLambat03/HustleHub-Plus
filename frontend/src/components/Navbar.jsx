import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="logo">
        HustleHub<span>+</span>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/gigs">Browse Gigs</Link>
        <a href="/#how-it-works">How It Works</a>
      </div>

      <div className="nav-actions">

        {token ? (
  <>
    {user?.role === 'freelancer' && (
      <>
        <Link to="/offer-service" className="login-link">
          Offer a Service
        </Link>

        <Link to="/dashboard" className="login-link">
          Dashboard
        </Link>
      </>
    )}

    <button
      onClick={handleLogout}
      className="signup-button"
    >
      Logout
    </button>
  </>
) : (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>

            <Link to="/register" className="signup-button">
              Sign Up
            </Link>
          </>
        )}

      </div>
    </nav>
  )
}

export default Navbar