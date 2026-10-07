import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [income, setIncome] = useState(0)
  const [serviceCount, setServiceCount] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(
      localStorage.getItem('user') || 'null'
    )

    if (!token) {
      navigate('/login')
      return
    }

    if (user?.role !== 'freelancer') {
      navigate('/')
      return
    }

    const fetchDashboard = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`
        }

        const [
          bookingsResponse,
          incomeResponse,
          gigsResponse
        ] = await Promise.all([
          fetch(
            'https://localhost:5000/api/bookings',
            { headers }
          ),
          fetch(
            'https://localhost:5000/api/transactions/income',
            { headers }
          ),
          fetch(
            'https://localhost:5000/api/gigs',
            { headers }
          )
        ])

        const bookingsData = await bookingsResponse.json()
        const incomeData = await incomeResponse.json()
        const gigsData = await gigsResponse.json()

        if (!bookingsResponse.ok) {
          throw new Error(
            bookingsData.message ||
            'Unable to load your bookings.'
          )
        }

        if (!incomeResponse.ok) {
          throw new Error(
            incomeData.message ||
            'Unable to load your income.'
          )
        }

        if (!gigsResponse.ok) {
          throw new Error(
            gigsData.message ||
            'Unable to load your services.'
          )
        }

        setBookings(bookingsData.data || [])

        /*
         * The income endpoint may return either:
         * { data: { totalIncome: ... } }
         * or
         * { data: ... }
         *
         * Handle both so the dashboard remains flexible.
         */
        const incomeValue =
          incomeData.data?.totalIncome ??
          incomeData.data?.total ??
          incomeData.data ??
          0

        setIncome(Number(incomeValue) || 0)

        const allGigs = gigsData.data || []

        const userId =
          user._id ||
          user.id ||
          user.userId

        const myGigs = allGigs.filter((gig) => {
          const freelancerId =
            gig.freelancerId?._id ||
            gig.freelancerId

          return (
            freelancerId?.toString() ===
            userId?.toString()
          )
        })

        setServiceCount(myGigs.length)

      } catch (error) {
        console.error(
          'Failed to load dashboard:',
          error
        )

        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [navigate])

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="dashboard-page">

      <section className="dashboard-header">

        <div>
          <p className="dashboard-eyebrow">
            FREELANCER DASHBOARD
          </p>

          <h1>
            Your HustleHub+
            <span> overview.</span>
          </h1>

          <p>
            Keep track of your services, bookings,
            and earnings in one place.
          </p>
        </div>

        <Link
          to="/offer-service"
          className="dashboard-create-button"
        >
          + Create a Service
        </Link>

      </section>

      {error && (
        <div className="dashboard-error">
          <strong>
            Something went wrong
          </strong>

          <p>
            {error}
          </p>
        </div>
      )}

      {!error && (
        <>
          <section className="dashboard-stats">

            <article className="dashboard-stat-card earnings">

              <div className="dashboard-stat-label">
                TOTAL EARNINGS
              </div>

              <strong>
                R{income.toLocaleString('en-ZA')}
              </strong>

              <p>
                From your bookings
              </p>

            </article>

            <article className="dashboard-stat-card">

              <div className="dashboard-stat-label">
                TOTAL BOOKINGS
              </div>

              <strong>
                {bookings.length}
              </strong>

              <p>
                Services booked by clients
              </p>

            </article>

            <article className="dashboard-stat-card">

              <div className="dashboard-stat-label">
                MY SERVICES
              </div>

              <strong>
                {serviceCount}
              </strong>

              <p>
                Services currently listed
              </p>

            </article>

          </section>

          <section className="dashboard-bookings">

            <div className="dashboard-section-header">

              <div>
                <p className="dashboard-section-eyebrow">
                  RECENT ACTIVITY
                </p>

                <h2>
                  Recent Bookings
                </h2>
              </div>

              <Link
                to="/my-services"
                className="dashboard-manage-button"
              >
                Manage My Services →
              </Link>

            </div>

            {bookings.length === 0 ? (
              <div className="dashboard-empty">

                <div className="dashboard-empty-icon">
                  +
                </div>

                <h3>
                  No bookings yet
                </h3>

                <p>
                  Once clients book your services,
                  they'll appear here.
                </p>

                <Link
                  to="/offer-service"
                  className="dashboard-empty-button"
                >
                  Create a Service →
                </Link>

              </div>
            ) : (
              <div className="dashboard-bookings-list">

                {bookings.slice(0, 5).map((booking) => {

                  const gig = booking.gigId
                  const client = booking.clientId

                  return (
                    <article
                      className="dashboard-booking"
                      key={booking._id}
                    >

                      <div className="dashboard-booking-client">

                        <div className="dashboard-client-avatar">
                          {(client?.name || 'C')
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {client?.name ||
                              'Client'}
                          </strong>

                          <span>
                            {client?.email ||
                              'Client booking'}
                          </span>
                        </div>

                      </div>

                      <div className="dashboard-booking-service">

                        <span>
                          SERVICE
                        </span>

                        <strong>
                          {gig?.title ||
                            'Booked Service'}
                        </strong>

                      </div>

                      <div className="dashboard-booking-amount">

                        <span>
                          AMOUNT
                        </span>

                        <strong>
                          R
                          {Number(
                            booking.amount ||
                            gig?.price ||
                            0
                          ).toLocaleString(
                            'en-ZA'
                          )}
                        </strong>

                      </div>

                      <div className="dashboard-booking-status">

                        <span
                          className={
                            booking.status ===
                            'confirmed'
                              ? 'dashboard-status confirmed'
                              : 'dashboard-status'
                          }
                        >
                          {booking.status ||
                            'confirmed'}
                        </span>

                      </div>

                    </article>
                  )
                })}

              </div>
            )}

          </section>

        </>
      )}

    </main>
  )
}

export default Dashboard