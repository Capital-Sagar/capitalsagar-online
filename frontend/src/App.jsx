import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('Connecting to backend...')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Backend returned an error')
        }
        return response.json()
      })
      .then((data) => {
        setMessage(data.message)
      })
      .catch(() => {
        setError('Could not connect to the backend')
      })
  }, [])

  return (
    <div>
      <h1>Capital Sagar</h1>

      {error ? (
        <p>{error}</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  )
}

export default App