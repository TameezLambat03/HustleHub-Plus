import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Bookings() {
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(
          'https://localhost:5000/api/bookings',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Unable to load your bookings.'
          )
        }

        setBookings(data.data || [])
      } catch (error) {
        console.error('Failed to load bookings:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [navigate])

  if (loading) {
    return (
      <main className="bookings-page">
        <div className="bookings-loading">
          <div className="bookings-loading-spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="bookings-page">

      <section className="bookings-header">
        <div>
          <p className="bookings-eyebrow">
            YOUR ACTIVITY
          </p>

          <h1>
            My Bookings
          </h1>

          <p>
            Keep track of the services you've booked
            and the freelancers you're working with.
          </p>
        </div>

        <Link
          to="/gigs"
          className="bookings-browse-button"
        >
          Browse Services →
        </Link>
      </section>

      {error && (
        <div className="bookings-error">
          <strong>Something went wrong</strong>
          <p>{error}</p>
        </div>
      )}

      {!error && bookings.length === 0 && (
        <section className="bookings-empty">

          <div className="bookings-empty-icon">
            ♡
          </div>

          <p className="bookings-eyebrow">
            NO BOOKINGS YET
          </p>

          <h2>
            Your next great service starts here.
          </h2>

          <p>
            Browse available services and find a freelancer
            who can help bring your idea to life.
          </p>

          <Link
            to="/gigs"
            className="bookings-empty-button"
          >
            Explore Services →
          </Link>

        </section>
      )}

      {!error && bookings.length > 0 && (
        <section className="bookings-list">

          <div className="bookings-count">
            <span>
              {bookings.length}{' '}
              {bookings.length === 1 ? 'booking' : 'bookings'}
            </span>
          </div>

          {bookings.map((booking) => {

            const gig = booking.gigId
            const freelancer = booking.freelancerId

            return (
              <article
                className="booking-card"
                key={booking._id}
              >

                <div className="booking-card-main">

                  <div className="booking-card-heading">

                    <div className="booking-title-group">

                      <p className="booking-category">
                        {gig?.category || 'SERVICE'}
                      </p>

                      <h2>
                        {gig?.title || 'Booked Service'}
                      </h2>

                    </div>

                    <span className="booking-status">
                      {booking.status || 'confirmed'}
                    </span>

                  </div>

                  <div className="booking-details-grid">

                    <div className="booking-detail">
                      <span>Freelancer</span>

                      <strong>
                        {freelancer?.name || 'Freelancer'}
                      </strong>
                    </div>

                    <div className="booking-detail">
                      <span>Price</span>

                      <strong>
                        R
                        {Number(
                          booking.amount ?? gig?.price ?? 0
                        ).toLocaleString('en-ZA')}
                      </strong>
                    </div>

                    <div className="booking-detail">
                      <span>Booked</span>

                      <strong>
                        {booking.createdAt
                          ? new Date(
                              booking.createdAt
                            ).toLocaleDateString(
                              'en-ZA',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }
                            )
                          : 'Recently'}
                      </strong>
                    </div>

                  </div>

                </div>

                {gig?._id && (
                  <Link
                    to={`/gigs/${gig._id}`}
                    className="booking-view-button"
                  >
                    View Service →
                  </Link>
                )}

              </article>
            )
          })}

        </section>
      )}

    </main>
  )
}

export default Bookings