import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function GigDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [gig, setGig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingData, setBookingData] = useState(null)

  useEffect(() => {
    const fetchGig = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `https://localhost:5000/api/gigs/${id}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not load this service.')
        }

        setGig(data.data)
      } catch (error) {
        console.error('Failed to load gig:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGig()
  }, [id])

  const handleBooking = async () => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')

    setBookingError('')

    if (!token) {
      navigate('/login')
      return
    }

    if (user?.role !== 'client') {
      setBookingError(
        'Only client accounts can book services.'
      )
      return
    }

    try {
      setBookingLoading(true)

      const response = await fetch(
        'https://localhost:5000/api/bookings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            gigId: id
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to create booking.'
        )
      }

      setBookingData(data.data)
      setBookingSuccess(true)
    } catch (error) {
      console.error('Booking failed:', error)
      setBookingError(error.message)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="gig-details-page">
        <div className="gig-details-container">
          <div className="gig-details-loading">
            <div className="loading-spinner"></div>
            <p>Loading service...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !gig) {
    return (
      <main className="gig-details-page">
        <div className="gig-details-container">
          <button
            className="gig-details-back"
            onClick={() => navigate('/gigs')}
          >
            ← Back to Browse Gigs
          </button>

          <div className="gig-details-state">
            <div className="state-icon">!</div>

            <p className="section-tag">SERVICE NOT FOUND</p>

            <h1>We couldn't load this service.</h1>

            <p>
              {error ||
                'The service you are looking for may no longer exist.'}
            </p>

            <button
              className="details-primary-button"
              onClick={() => navigate('/gigs')}
            >
              Browse Gigs
            </button>
          </div>
        </div>
      </main>
    )
  }

  const freelancerName =
    gig.freelancerId?.name || 'Freelancer'

  const freelancerInitial =
    freelancerName.charAt(0).toUpperCase()

  return (
    <main className="gig-details-page">
      <div className="gig-details-container">

        <button
          className="gig-details-back"
          onClick={() => navigate('/gigs')}
        >
          ← Back to Browse Gigs
        </button>

        {bookingSuccess ? (
          <div className="booking-success-page">

            <div className="booking-success-icon">
              ✓
            </div>

            <p className="section-tag">
              BOOKING CONFIRMED
            </p>

            <h1>
              You're all booked!
            </h1>

            <p className="booking-success-description">
              Your booking for <strong>{gig.title}</strong> has
              been confirmed and payment has been simulated
              successfully.
            </p>

            <div className="booking-success-card">

              <div>
                <span>Service</span>
                <strong>{gig.title}</strong>
              </div>

              <div>
                <span>Freelancer</span>
                <strong>{freelancerName}</strong>
              </div>

              <div>
                <span>Amount</span>
                <strong>
                  R{Number(gig.price).toLocaleString('en-ZA')}
                </strong>
              </div>

              <div>
                <span>Booking status</span>
                <strong className="success-status">
                  Confirmed
                </strong>
              </div>

              <div>
                <span>Payment status</span>
                <strong className="success-status">
                  Completed
                </strong>
              </div>

            </div>

            <div className="booking-success-actions">

              <button
                className="details-primary-button"
                onClick={() => navigate('/bookings')}
              >
                View My Bookings
              </button>

              <button
                className="details-secondary-button"
                onClick={() => navigate('/gigs')}
              >
                Browse More Gigs
              </button>

            </div>
          </div>
        ) : (
          <div className="gig-details-layout">

            <section className="gig-details-main">

              <div className="gig-details-category-row">

                <span className="gig-details-category">
                  {gig.category}
                </span>

                {gig.isAvailable !== false && (
                  <span className="gig-details-available">
                    <span></span>
                    Available
                  </span>
                )}

              </div>

              <p className="section-tag">
                SERVICE
              </p>

              <h1>{gig.title}</h1>

              <p className="gig-details-intro">
                A service offered by {freelancerName} on
                HustleHub+.
              </p>

              <div className="gig-details-divider"></div>

              <div className="gig-details-section">

                <p className="details-label">
                  ABOUT THIS SERVICE
                </p>

                <h2>
                  What you'll get
                </h2>

                <p className="gig-full-description">
                  {gig.description}
                </p>

              </div>

              <div className="gig-details-divider"></div>

              <div className="freelancer-section">

                <p className="details-label">
                  YOUR FREELANCER
                </p>

                <div className="freelancer-profile">

                  <div className="large-freelancer-avatar">
                    {freelancerInitial}
                  </div>

                  <div>

                    <h3>
                      {freelancerName}
                    </h3>

                    {gig.freelancerId?.email && (
                      <p>
                        {gig.freelancerId.email}
                      </p>
                    )}

                    <span className="freelancer-status">
                      HustleHub+ Freelancer
                    </span>

                  </div>

                </div>

              </div>

            </section>

            <aside className="gig-details-sidebar">

              <div className="booking-card">

                <div className="booking-card-top">

                  <span className="booking-card-label">
                    STARTING FROM
                  </span>

                  <strong>
                    R{Number(gig.price).toLocaleString('en-ZA')}
                  </strong>

                </div>

                <div className="booking-card-divider"></div>

                <div className="booking-info">

                  <div>
                    <span>✓</span>
                    Service available
                  </div>

                  <div>
                    <span>✓</span>
                    Direct freelancer service
                  </div>

                  <div>
                    <span>✓</span>
                    Secure booking process
                  </div>

                </div>

                {bookingError && (
                  <p className="booking-error">
                    {bookingError}
                  </p>
                )}

                <button
                  className="book-service-button"
                  disabled={
                    gig.isAvailable === false ||
                    bookingLoading
                  }
                  onClick={handleBooking}
                >
                  {bookingLoading
                    ? 'Confirming Booking...'
                    : gig.isAvailable === false
                      ? 'Currently Unavailable'
                      : 'Book This Service →'}
                </button>

                <p className="booking-note">
                  Your booking will be confirmed immediately
                  and payment will be simulated for this
                  project.
                </p>

              </div>

              <div className="details-tip">

                <span>✦</span>

                <div>

                  <strong>
                    Ready to get started?
                  </strong>

                  <p>
                    Review the service details and book when
                    you're ready to work with this freelancer.
                  </p>

                </div>

              </div>

            </aside>

          </div>
        )}

      </div>
    </main>
  )
}

export default GigDetails