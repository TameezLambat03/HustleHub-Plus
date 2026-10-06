import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function MyServices() {
  const navigate = useNavigate()

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')

    if (!token) {
      navigate('/login')
      return
    }

    if (user?.role !== 'freelancer') {
      navigate('/')
      return
    }

    const fetchMyServices = async () => {
      try {
        const response = await fetch(
          'https://localhost:5000/api/gigs',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Unable to load your services.'
          )
        }

        const allGigs = data.data || []

        const userId = user._id || user.id || user.userId

        const myGigs = allGigs.filter((gig) => {
          const freelancerId =
            gig.freelancerId?._id ||
            gig.freelancerId

          return freelancerId?.toString() === userId?.toString()
        })

        setServices(myGigs)

      } catch (error) {
        console.error(
          'Failed to load services:',
          error
        )

        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMyServices()
  }, [navigate])

  const handleDelete = async (gigId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this service? This cannot be undone.'
    )

    if (!confirmed) {
      return
    }

    const token = localStorage.getItem('token')

    try {
      setDeletingId(gigId)
      setError('')

      const response = await fetch(
        `https://localhost:5000/api/gigs/${gigId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to delete service.'
        )
      }

      setServices((currentServices) =>
        currentServices.filter(
          (service) => service._id !== gigId
        )
      )

    } catch (error) {
      console.error(
        'Failed to delete service:',
        error
      )

      setError(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <main className="my-services-page">
        <div className="my-services-loading">
          <div className="my-services-loading-spinner"></div>
          <p>Loading your services...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="my-services-page">

      <section className="my-services-header">

        <div>
          <p className="my-services-eyebrow">
            FREELANCER SPACE
          </p>

          <h1>
            My Services
          </h1>

          <p>
            Manage the services you've listed on
            HustleHub+.
          </p>
        </div>

        <Link
          to="/offer-service"
          className="my-services-create-button"
        >
          + Create a Service
        </Link>

      </section>

      {error && (
        <div className="my-services-error">
          <strong>Something went wrong</strong>
          <p>{error}</p>
        </div>
      )}

      {!error && services.length === 0 && (
        <section className="my-services-empty">

          <div className="my-services-empty-icon">
            +
          </div>

          <p className="my-services-eyebrow">
            NO SERVICES YET
          </p>

          <h2>
            Start offering your skills.
          </h2>

          <p>
            Create your first service and let clients
            discover what you can do.
          </p>

          <Link
            to="/offer-service"
            className="my-services-empty-button"
          >
            Create Your First Service →
          </Link>

        </section>
      )}

      {!error && services.length > 0 && (
        <section className="my-services-list">

          <div className="my-services-count">
            <span>
              {services.length}{' '}
              {services.length === 1
                ? 'service'
                : 'services'}
            </span>
          </div>

          {services.map((service) => (
            <article
              className="my-service-card"
              key={service._id}
            >

              <div className="my-service-card-content">

                <div className="my-service-card-heading">

                  <div className="my-service-title-group">

                    <p className="my-service-category">
                      {service.category || 'SERVICE'}
                    </p>

                    <h2>
                      {service.title}
                    </h2>

                  </div>

                  <span
                    className={
                      service.isAvailable === false
                        ? 'my-service-status unavailable'
                        : 'my-service-status'
                    }
                  >
                    {service.isAvailable === false
                      ? 'Unavailable'
                      : 'Available'}
                  </span>

                </div>

                <p className="my-service-description">
                  {service.description}
                </p>

                <div className="my-service-footer">

                  <div className="my-service-price">
                    <span>Starting price</span>

                    <strong>
                      R
                      {Number(
                        service.price
                      ).toLocaleString('en-ZA')}
                    </strong>
                  </div>

                  <div className="my-service-actions">

                    <Link
                      to={`/gigs/${service._id}`}
                      className="my-service-view-button"
                    >
                      View
                    </Link>

                    <Link
                      to={`/edit-service/${service._id}`}
                      className="my-service-edit-button"
                    >
                      Edit
                    </Link>

                    <button
                      className="my-service-delete-button"
                      onClick={() =>
                        handleDelete(service._id)
                      }
                      disabled={
                        deletingId === service._id
                      }
                    >
                      {deletingId === service._id
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>

                  </div>

                </div>

              </div>

            </article>
          ))}

        </section>
      )}

    </main>
  )
}

export default MyServices