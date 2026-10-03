import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function Bookings() {
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])

  const [formData, setFormData] = useState({
    room_id: '',
    guest_name: '',
    guest_email: '',
    check_in_date: '',
    check_out_date: '',
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      window.location.href = '/login'
      return
    }

    let user

    try {
      user = JSON.parse(storedUser)
    } catch (error) {
      console.error('Invalid user data:', error)
      localStorage.removeItem('user')
      window.location.href = '/login'
      return
    }

    if (!user?.id) {
      alert('User information is missing. Please login again.')
      localStorage.removeItem('user')
      window.location.href = '/login'
      return
    }

    loadRooms()
    loadBookings(user.id)
  }, [])

  const loadRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('status', 'available')

    if (!error) {
      setRooms(data || [])
    } else {
      console.error('Failed to load rooms:', error)
    }
  }

  const loadBookings = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/user/${userId}`
      )

      if (!response.ok) {
        throw new Error('Failed to load bookings')
      }

      const data = await response.json()

      setBookings(data || [])
    } catch (error) {
      console.error('Failed to load bookings:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleBooking = async (e) => {
    e.preventDefault()

    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      alert('Please login again')
      window.location.href = '/login'
      return
    }

    let user

    try {
      user = JSON.parse(storedUser)
    } catch (error) {
      console.error('Invalid user data:', error)
      alert('Session data is invalid. Please login again.')
      localStorage.removeItem('user')
      window.location.href = '/login'
      return
    }

    if (!user?.id) {
      alert('User information is missing. Please login again.')
      localStorage.removeItem('user')
      window.location.href = '/login'
      return
    }

    const selectedRoom = rooms.find(
      (room) => room.id === Number(formData.room_id)
    )

    if (!selectedRoom) {
      alert('Please select a room')
      return
    }

    if (
      new Date(formData.check_out_date) <=
      new Date(formData.check_in_date)
    ) {
      alert('Check-out date must be after check-in date')
      return
    }

    const { error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: user.id,
          room_id: Number(formData.room_id),
          guest_name: formData.guest_name,
          guest_email: formData.guest_email,
          check_in_date: formData.check_in_date,
          check_out_date: formData.check_out_date,
          total_amount: selectedRoom.price_per_night,
          booking_status: 'confirmed',
        },
      ])

    if (error) {
      console.error('Booking error:', error)
      alert('Booking failed')
      return
    }

    const { error: roomUpdateError } = await supabase
      .from('rooms')
      .update({
        status: 'booked',
      })
      .eq('id', Number(formData.room_id))

    if (roomUpdateError) {
      console.error('Room status update error:', roomUpdateError)
      alert('Booking created, but room status could not be updated.')
      return
    }

    alert('Booking created successfully')

    await loadBookings(user.id)
    await loadRooms()

    setFormData({
      room_id: '',
      guest_name: '',
      guest_email: '',
      check_in_date: '',
      check_out_date: '',
    })
  }

  return (
    <div className="container mt-4">
      <h1>Bookings</h1>

      <form onSubmit={handleBooking}>
        <select
          name="room_id"
          value={formData.room_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Room</option>

          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              Room {room.room_number} - {room.room_type}
            </option>
          ))}
        </select>

        <br />
        <br />

        <input
          type="text"
          name="guest_name"
          placeholder="Guest Name"
          value={formData.guest_name}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="email"
          name="guest_email"
          placeholder="Guest Email"
          value={formData.guest_email}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="date"
          name="check_in_date"
          value={formData.check_in_date}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="date"
          name="check_out_date"
          value={formData.check_out_date}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <button type="submit">
          Book Room
        </button>
      </form>

      <hr />

      <h2>Recent Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '8px',
            }}
          >
            <p>
              <strong>Guest:</strong> {booking.guestName}
            </p>

            <p>
              <strong>Email:</strong> {booking.guestEmail}
            </p>

            <p>
              <strong>Room:</strong>{' '}
              {booking.room?.roomNumber || booking.roomId}
            </p>

            <p>
              <strong>Type:</strong>{' '}
              {booking.room?.roomType || 'Room'}
            </p>

            <p>
              <strong>Check In:</strong> {booking.checkInDate}
            </p>

            <p>
              <strong>Check Out:</strong> {booking.checkOutDate}
            </p>

            <p>
              <strong>Amount:</strong> ₹{booking.totalAmount}
            </p>

            <p>
              <strong>Status:</strong> {booking.bookingStatus}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default Bookings