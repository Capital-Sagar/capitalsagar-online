import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Hotel Reservation
        </Link>

        <div className="navbar-nav">

          <Link className="nav-link" to="/">
            Home
          </Link>

          <Link className="nav-link" to="/rooms">
            Rooms
          </Link>

          <Link className="nav-link" to="/bookings">
            Bookings
          </Link>

          {user && (
            <Link className="nav-link" to="/dashboard">
              Dashboard
            </Link>
          )}

          {!user && (
            <>
              <Link className="nav-link" to="/login">
                Login
              </Link>

              <Link className="nav-link" to="/register">
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <span
                className="nav-link"
                style={{ color: '#fff' }}
              >
                Hi, {user.fullname}
              </span>

              <button
                className="btn btn-sm btn-danger ms-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar