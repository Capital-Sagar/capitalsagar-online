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
    const user = localStorage.getItem('user')

    if (!user) {
      window.location.href = '/login'
      return
    }

    loadRooms()
    loadBookings()
  }, [])

  const loadRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('status', 'available')

    if (!error) {
      setRooms(data || [])
    }
  }

  const loadBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        rooms (
          room_number,
          room_type
        )
      `)
      .order('id', { ascending: false })

    if (!error) {
      setBookings(data || [])
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
          user_id: 1,
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
      console.error(error)
      alert('Booking failed')
      return
    }

    await supabase
      .from('rooms')
      .update({
        status: 'booked',
      })
      .eq('id', Number(formData.room_id))

    alert('Booking created successfully')

    await loadBookings()
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

        <br /><br />

        <input
          type="text"
          name="guest_name"
          placeholder="Guest Name"
          value={formData.guest_name}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="email"
          name="guest_email"
          placeholder="Guest Email"
          value={formData.guest_email}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="date"
          name="check_in_date"
          value={formData.check_in_date}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="date"
          name="check_out_date"
          value={formData.check_out_date}
          onChange={handleChange}
          required
        />

        <br /><br />

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
              <strong>Guest:</strong> {booking.guest_name}
            </p>

            <p>
              <strong>Email:</strong> {booking.guest_email}
            </p>

            <p>
              <strong>Room:</strong> {booking.rooms?.room_number}
            </p>

            <p>
              <strong>Type:</strong> {booking.rooms?.room_type}
            </p>

            <p>
              <strong>Check In:</strong> {booking.check_in_date}
            </p>

            <p>
              <strong>Check Out:</strong> {booking.check_out_date}
            </p>

            <p>
              <strong>Amount:</strong> ₹{booking.total_amount}
            </p>

            <p>
              <strong>Status:</strong> {booking.booking_status}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default Bookings