import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'

import Home from './pages/Home'
import Rooms from './pages/Rooms'
import Bookings from './pages/Bookings'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div style={{ padding: '20px' }}>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/rooms" element={<Rooms />} />
  <Route path="/bookings" element={<Bookings />} />
  <Route path="/dashboard" element={<Dashboard />} />

  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Routes>
      </div>
    </BrowserRouter>
  )
}

export default App