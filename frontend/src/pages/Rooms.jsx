import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function Rooms() {
  const [rooms, setRooms] = useState([])

  const [formData, setFormData] = useState({
    room_number: '',
    room_type: '',
    price_per_night: '',
    capacity: '',
  })

  useEffect(() => {
    const user = localStorage.getItem('user')

    if (!user) {
      window.location.href = '/login'
      return
    }

    loadRooms()
  }, [])

  const loadRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('id', { ascending: false })

    if (!error) {
      setRooms(data || [])
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddRoom = async (e) => {
    e.preventDefault()

    if (
      !formData.room_number ||
      !formData.room_type ||
      !formData.price_per_night ||
      !formData.capacity
    ) {
      alert('Please fill all fields')
      return
    }

    const roomExists = rooms.some(
  (room) =>
    String(room.room_number) ===
    String(formData.room_number)
)

    if (roomExists) {
      alert('Room number already exists')
      return
    }

    const { error } = await supabase
      .from('rooms')
      .insert([
        {
          room_number: formData.room_number,
          room_type: formData.room_type,
          price_per_night: Number(
            formData.price_per_night
          ),
          capacity: Number(formData.capacity),
          status: 'available',
        },
      ])

    if (error) {
      console.error(error)
      alert('Failed to add room')
      return
    }

    alert('Room added successfully')

    setFormData({
      room_number: '',
      room_type: '',
      price_per_night: '',
      capacity: '',
    })

    loadRooms()
  }

  const handleDeleteRoom = async (roomId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this room?'
    )

    if (!confirmDelete) return

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId)

    if (error) {
      console.error(error)
      alert('Failed to delete room')
      return
    }

    alert('Room deleted successfully')

    loadRooms()
  }

  return (
    <div className="container mt-4">

      <h1 className="mb-4">
        Room Management
      </h1>

      <div className="card p-4 mb-4 shadow">
        <h3>Add Room</h3>

        <form onSubmit={handleAddRoom}>

          <input
            type="text"
            name="room_number"
            className="form-control mb-3"
            placeholder="Room Number"
            value={formData.room_number}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="room_type"
            className="form-control mb-3"
            placeholder="Room Type"
            value={formData.room_type}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price_per_night"
            className="form-control mb-3"
            placeholder="Price Per Night"
            value={formData.price_per_night}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="capacity"
            className="form-control mb-3"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn btn-success"
          >
            Add Room
          </button>

        </form>
      </div>

      <h2 className="mb-3">
        Available Rooms
      </h2>

      {rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        rooms.map((room) => (
          <div
            key={room.id}
            className="card mb-3 shadow"
          >
            <div className="card-body">

              <h4>
                Room {room.room_number}
              </h4>

              <p>
                <strong>Type:</strong>{' '}
                {room.room_type}
              </p>

              <p>
                <strong>Price:</strong>{' '}
                ₹{room.price_per_night}
              </p>

              <p>
                <strong>Capacity:</strong>{' '}
                {room.capacity}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                {room.status}
              </p>

              <button
                className="btn btn-danger"
                onClick={() =>
                  handleDeleteRoom(room.id)
                }
              >
                Delete Room
              </button>

            </div>
          </div>
        ))
      )}

    </div>
  )
}

export default Rooms