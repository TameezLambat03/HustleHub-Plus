import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Gigs() {
  const navigate = useNavigate()

  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await fetch('https://localhost:5000/api/gigs')

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not load gigs')
        }

        setGigs(data.data || [])
      } catch (error) {
        console.error('Failed to load gigs:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGigs()
  }, [])

  return (
    <main className="gigs-page">

      <div className="gigs-container">

        {/* Header */}
        <header className="gigs-header">

          <div>
            <p className="section-tag">THE MARKETPLACE</p>

            <h1>
              Find your next
              <span> great hustle.</span>
            </h1>

            <p className="gigs-intro">
              Browse services from freelancers who are ready
              to bring your ideas to life.
            </p>
          </div>

          <div className="gig-count">
            <strong>{gigs.length}</strong>
            <span>
              {gigs.length === 1 ? 'service' : 'services'}
              <br />
              available
            </span>
          </div>

        </header>

        {/* Loading */}
        {loading && (
          <div className="gigs-state">
            <div className="loading-spinner"></div>
            <p>Finding services for you...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="gigs-state error-state">
            <div className="state-icon">!</div>

            <h2>We couldn't load the marketplace.</h2>

            <p>{error}</p>

            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && gigs.length === 0 && (
          <div className="gigs-state">

            <div className="state-icon">✦</div>

            <h2>No services yet.</h2>

            <p>
              There aren't any services available yet.
              Check back soon or offer your own service.
            </p>

            <button onClick={() => navigate('/offer-service')}>
              Offer a Service
            </button>

          </div>
        )}

        {/* Gigs */}
        {!loading && !error && gigs.length > 0 && (
          <section className="gig-grid">

            {gigs.map((gig) => (
              <article className="gig-card" key={gig._id}>

                <div className="gig-card-top">

                  <span className="gig-category">
                    {gig.category}
                  </span>

                  {gig.isAvailable !== false && (
                    <span className="available-badge">
                      Available
                    </span>
                  )}

                </div>

                <div className="gig-card-content">

                  <h2>{gig.title}</h2>

                  <p className="gig-description">
                    {gig.description}
                  </p>

                </div>

                <div className="gig-card-divider"></div>

                <div className="gig-card-bottom">

                  <div className="freelancer-info">

                    <div className="freelancer-avatar">
                      {gig.freelancerId?.name
                        ? gig.freelancerId.name.charAt(0).toUpperCase()
                        : '?'}
                    </div>

                    <div>
                      <span>OFFERED BY</span>

                      <strong>
                        {gig.freelancerId?.name || 'Freelancer'}
                      </strong>
                    </div>

                  </div>

                  <div className="gig-price">

                    <span>FROM</span>

                    <strong>
                      R{Number(gig.price).toLocaleString('en-ZA')}
                    </strong>

                  </div>

                </div>

                <button
                  className="gig-view-button"
                  onClick={() => navigate(`/gigs/${gig._id}`)}
                >
                  View Service →
                </button>

              </article>
            ))}

          </section>
        )}

      </div>

    </main>
  )
}

export default Gigs