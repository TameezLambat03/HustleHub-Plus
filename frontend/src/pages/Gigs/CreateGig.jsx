import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function CreateGig() {
  const navigate = useNavigate()
  const { id } = useParams()

  const isEditing = Boolean(id)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingGig, setLoadingGig] = useState(isEditing)

  /*
    Load the existing gig when editing
  */
  useEffect(() => {
    if (!isEditing) {
      return
    }

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

    const fetchGig = async () => {
      try {
        const response = await fetch(
          `https://localhost:5000/api/gigs/${id}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Unable to load this service.'
          )
        }

        const gig = data.data

        setTitle(gig.title || '')
        setCategory(gig.category || '')
        setDescription(gig.description || '')
        setPrice(
          gig.price !== undefined && gig.price !== null
            ? gig.price.toString()
            : ''
        )

      } catch (error) {
        console.error(
          'Failed to load gig:',
          error
        )

        setError(error.message)
      } finally {
        setLoadingGig(false)
      }
    }

    fetchGig()
  }, [id, isEditing, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    const token = localStorage.getItem('token')

    if (!token) {
      setError(
        'You need to be logged in to offer a service.'
      )
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        isEditing
          ? `https://localhost:5000/api/gigs/${id}`
          : 'https://localhost:5000/api/gigs',
        {
          method: isEditing ? 'PUT' : 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            title,
            description,
            category,
            price: Number(price)
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        const validationMessage =
          data.errors?.[0]?.msg ||
          data.message ||
          `Could not ${
            isEditing
              ? 'update'
              : 'publish'
          } your service.`

        throw new Error(validationMessage)
      }

      setSuccess(
        isEditing
          ? 'Your service has been updated successfully!'
          : 'Your service has been published successfully!'
      )

      setTimeout(() => {
        navigate('/my-services')
      }, 1000)

    } catch (error) {
      console.error(
        'Failed to save service:',
        error
      )

      setError(error.message)

    } finally {
      setLoading(false)
    }
  }

  if (loadingGig) {
    return (
      <main className="offer-page">
        <div className="offer-container">
          <div className="my-services-loading">
            <div className="my-services-loading-spinner"></div>
            <p>Loading your service...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="offer-page">

      <div className="offer-container">

        {/* Top navigation */}

        <button
          className="offer-back"
          onClick={() => navigate('/my-services')}
        >
          ← Back to My Services
        </button>

        {/* Page heading */}

        <header className="offer-header">

          <div>

            <p className="section-tag">
              {isEditing
                ? 'EDIT SERVICE'
                : 'OFFER A SERVICE'}
            </p>

            <h1>
              {isEditing
                ? 'Make your service'
                : 'Turn your skills into'}
              <span>
                {isEditing
                  ? ' even better.'
                  : ' something people need.'}
              </span>
            </h1>

            <p className="offer-intro">
              {isEditing
                ? 'Update your service details, pricing, or description.'
                : 'Tell clients what you can do, set your price, and put your service out there.'}
            </p>

          </div>

          <div className="offer-number">

            <span>
              {isEditing ? '02' : '01'}
            </span>

            <p>
              {isEditing
                ? 'Update your listing'
                : 'Create your listing'}
            </p>

          </div>

        </header>

        {/* Main content */}

        <div className="offer-layout">

          {/* Form */}

          <section className="offer-form-card">

            <div className="form-section-heading">

              <span>
                {isEditing ? '02' : '01'}
              </span>

              <div>

                <h2>
                  Service details
                </h2>

                <p>
                  {isEditing
                    ? 'Update the information clients see about your service.'
                    : 'Give clients a clear idea of what you\'re offering.'}
                </p>

              </div>

            </div>

            {error && (
              <div className="form-message error">
                {error}
              </div>
            )}

            {success && (
              <div className="form-message success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="field-group">

                <label htmlFor="title">
                  What are you offering?
                </label>

                <input
                  id="title"
                  type="text"
                  placeholder="e.g. I'll build a modern React website"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  required
                />

                <small>
                  Make your title clear and easy to understand.
                </small>

              </div>

              <div className="field-group">

                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  required
                >

                  <option value="">
                    Choose a category
                  </option>

                  <option value="Development">
                    Development
                  </option>

                  <option value="Design">
                    Design
                  </option>

                  <option value="Writing">
                    Writing
                  </option>

                  <option value="Media">
                    Media
                  </option>

                  <option value="Marketing">
                    Marketing
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              <div className="field-group">

                <label htmlFor="description">
                  Tell clients about your service
                </label>

                <textarea
                  id="description"
                  placeholder="Explain what you'll provide, what clients can expect, and what makes your service useful..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows="7"
                  required
                />

                <small>
                  A good description helps clients understand exactly
                  what they're getting.
                </small>

              </div>

              <div className="field-group">

                <label htmlFor="price">
                  Your price
                </label>

                <div className="price-field">

                  <span>R</span>

                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="500"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    required
                  />

                </div>

              </div>

              <div className="publish-area">

                <div>

                  <strong>
                    {isEditing
                      ? 'Ready to save your changes?'
                      : 'Ready to share your service?'}
                  </strong>

                  <p>
                    {isEditing
                      ? 'Your updated listing will be visible to clients on HustleHub+.'
                      : 'Your listing will become visible to clients on HustleHub+.'}
                  </p>

                </div>

                <button
                  type="submit"
                  className="publish-button"
                  disabled={loading}
                >
                  {loading
                    ? isEditing
                      ? 'Saving...'
                      : 'Publishing...'
                    : isEditing
                      ? 'Save Changes →'
                      : 'Publish Service →'}
                </button>

              </div>

            </form>

          </section>

          {/* Preview */}

          <aside className="listing-preview">

            <div className="preview-top">

              <div>

                <p className="preview-label">
                  LIVE PREVIEW
                </p>

                <h3>
                  Your service
                </h3>

              </div>

              <span className="preview-dot"></span>

            </div>

            <div className="preview-card">

              <div className="preview-category">
                {category || 'CATEGORY'}
              </div>

              <h2>
                {title ||
                  'Your service title will appear here'}
              </h2>

              <p className="preview-description">
                {description ||
                  'Your service description will appear here. Give clients a reason to choose your service.'}
              </p>

              <div className="preview-divider"></div>

              <div className="preview-bottom">

                <div>

                  <span className="preview-price-label">
                    STARTING FROM
                  </span>

                  <strong>
                    R{price || '0'}
                  </strong>

                </div>

                <div className="preview-avatar">
                  +
                </div>

              </div>

            </div>

            <div className="preview-tip">

              <span>✦</span>

              <div>

                <strong>
                  Make it stand out
                </strong>

                <p>
                  Clear titles, useful descriptions and fair
                  pricing help clients understand your service.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  )
}

export default CreateGig