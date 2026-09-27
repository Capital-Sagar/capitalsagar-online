import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function Dashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    const { data: rooms } = await supabase
      .from('rooms')
      .select('*')

    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')

    const totalRooms = rooms?.length || 0

    const availableRooms =
      rooms?.filter(
        (room) => room.status === 'available'
      ).length || 0

    const totalBookings = bookings?.length || 0

    const totalRevenue =
      bookings?.reduce(
        (sum, booking) =>
          sum + Number(booking.total_amount || 0),
        0
      ) || 0

    setStats({
      totalRooms,
      availableRooms,
      totalBookings,
      totalRevenue,
    })
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      <div className="row g-4">

        <div className="col-md-3">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5>Total Rooms</h5>
              <h2>{stats.totalRooms}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5>Available Rooms</h5>
              <h2>{stats.availableRooms}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5>Total Bookings</h5>
              <h2>{stats.totalBookings}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5>Total Revenue</h5>
              <h2>₹{stats.totalRevenue}</h2>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard