 import { useNavigate } from 'react-router-dom'
function Home() {
  const navigate = useNavigate()
 
  return (
    <main className="home">

      {/* Hero section */}
      <section className="hero">
        <p className="hero-tag">YOUR SKILLS. YOUR HUSTLE.</p>

        <h1>
          Find your next
          <span> great hustle.</span>
        </h1>

        <p className="hero-description">
          Discover talented freelancers, find the services you need,
          and turn ideas into reality.
        </p>

        <div className="hero-buttons">
  <button onClick={() => navigate('/gigs')}>
    Browse Gigs
  </button>

  <button
    className="secondary-button"
    onClick={() => navigate('/register')}
  >
    Become a Freelancer
  </button>
</div>
      </section>

      {/* Categories */}
      <section className="categories">
        <p className="section-tag">EXPLORE</p>

        <h2>What are you looking for?</h2>

        <div className="category-grid">
          <div className="category-card">
            <span>💻</span>
            <h3>Development</h3>
            <p>Websites, apps and software</p>
          </div>

          <div className="category-card">
            <span>🎨</span>
            <h3>Design</h3>
            <p>Logos, graphics and branding</p>
          </div>

          <div className="category-card">
            <span>✍️</span>
            <h3>Writing</h3>
            <p>Content, copy and editing</p>
          </div>

          <div className="category-card">
            <span>📸</span>
            <h3>Media</h3>
            <p>Photography, video and more</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="how-it-works">
        <p className="section-tag">SIMPLE PROCESS</p>

        <h2>How HustleHub+ works</h2>

        <div className="steps">

          <div className="step">
            <span>01</span>
            <h3>Find a gig</h3>
            <p>Browse services from freelancers with the skills you need.</p>
          </div>

          <div className="step">
            <span>02</span>
            <h3>Book a service</h3>
            <p>Choose a gig and send your booking request.</p>
          </div>

          <div className="step">
            <span>03</span>
            <h3>Get it done</h3>
            <p>Work with your freelancer and bring your project to life.</p>
          </div>

        </div>
      </section>

    </main>
  )
}

export default Home