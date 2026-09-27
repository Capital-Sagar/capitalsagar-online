import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function Rooms() {
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    loadRooms()
  }, [])

  const loadRooms = async () => {
    const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('status', 'available')
    if (!error) {
      setRooms(data)
    }
  }

  return (
    <div>
      <h1>Available Rooms</h1>

      {rooms.map((room) => (
        <div
          key={room.id}
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '10px'
          }}
        >
          <h3>Room {room.room_number}</h3>
          <p>Type: {room.room_type}</p>
          <p>Price: ₹{room.price_per_night}</p>
          <p>Capacity: {room.capacity}</p>
          <p>Status: {room.status}</p>
        </div>
      ))}
    </div>
  )
}

export default Rooms