function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        HustleHub<span>+</span>
      </div>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/gigs">Browse Gigs</a>
        <a href="#how-it-works">How It Works</a>
      </div>

      <div className="nav-actions">
        <a href="/login" className="login-link">
          Login
        </a>

        <a href="/register" className="signup-button">
          Sign Up
        </a>
      </div>
    </nav>
  )
}

export default Navbar