import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error('Please log in again.')
        }

        const response = await fetch('https://localhost:5000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load users.')
        }

        setUsers(data.users || [])
      } catch (err) {
        setError(err.message || 'Could not connect to the backend.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(search.toLowerCase())

    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <span className="admin-label">HustleHub+ Administration</span>
          <h1>User Management</h1>
          <p>View and search registered marketplace users.</p>
        </div>

        <Link className="admin-back-link" to="/admin">
          Back to Dashboard
        </Link>
      </header>

      <section className="admin-card">
        <div className="user-management-toolbar">
          <div>
            <h2>Registered Users</h2>
            <p>{users.length} users in total</p>
          </div>

          <input
            type="search"
            className="user-search"
            placeholder="Search name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="user-role-filter"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="all">All roles</option>
            <option value="client">Clients</option>
            <option value="freelancer">Freelancers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {loading && <p>Loading users...</p>}

        {error && <p className="admin-error">{error}</p>}

        {!loading && !error && (
          <>
            <p className="user-results-count">
              Showing {filteredUsers.length} of {users.length} users
            </p>

            {filteredUsers.length === 0 ? (
              <p>No users match your search.</p>
            ) : (
              <div className="user-table-wrapper">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Registered</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`user-role-badge ${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('en-ZA')
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default UserManagement