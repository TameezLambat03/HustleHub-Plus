import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error('Please log in again.')
        }

        const response = await fetch('https://localhost:5000/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load dashboard statistics.')
        }

        setStats(data.stats)
      } catch (err) {
        setError(err.message || 'Could not connect to the backend.')
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === 'admin') {
      fetchStats()
    } else {
      setLoading(false)
    }
  }, [])

  if (user?.role !== 'admin') {
    return (
      <main className="container">
        <h2>Access denied</h2>
        <p>This page is only available to administrators.</p>
        <Link to="/">Return Home</Link>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="admin-dashboard">
        <h1>Loading dashboard...</h1>
      </main>
    )
  }

  if (error) {
    return (
      <main className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <p className="admin-error">{error}</p>
      </main>
    )
  }

  const money = (amount) =>
    new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount || 0)

  const cards = [
    {
      title: 'User Management',
      value: stats.users.total,
      details: `${stats.users.clients} clients · ${stats.users.freelancers} freelancers · ${stats.users.admins} admins`,
      icon: '👥',
      iconClass: 'users',
    },
    {
      title: 'Service Management',
      value: stats.gigs.total,
      details: `${stats.gigs.available} available services`,
      icon: '🛠️',
      iconClass: 'services',
    },
    {
      title: 'Bookings',
      value: stats.bookings.total,
      details: `${stats.bookings.pending} pending · ${stats.bookings.confirmed} confirmed · ${stats.bookings.completed} completed · ${stats.bookings.cancelled} cancelled`,
      icon: '📅',
      iconClass: 'bookings',
    },
    {
      title: 'Transactions',
      value: stats.transactions.completed,
      details: `${money(stats.transactions.completedAmount)} in completed transactions`,
      icon: '💳',
      iconClass: 'transactions',
    },
  ]

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <span className="admin-label">HustleHub+ Administration</span>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user.name || 'Administrator'}.</p>
          <p>Here's an overview of your marketplace.</p>
        </div>

        <span className="admin-live-status">● API Connected</span>
      </header>

      <h2 className="admin-section-title">Marketplace Overview</h2>

      <section className="admin-overview">
        {cards.map((card) => (
  <article className="admin-card" key={card.title}>
    <div className="admin-card-top">
      <h3>{card.title}</h3>
      <span className={`admin-card-icon ${card.iconClass}`}>
        {card.icon}
      </span>
    </div>

    <p className="admin-stat">{card.value}</p>
    <p className="admin-card-details">{card.details}</p>

    {card.title === 'User Management' && (
      <Link className="admin-card-link" to="/admin/users">
        View all users →
      </Link>
    )}
  </article>
))}
      </section>
    </main>
  )
}

export default AdminDashboard