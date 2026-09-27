import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    fetch("/api/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to connect");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setBackendStatus("Connected");
      })
      .catch((error) => {
        console.error(error);
        setBackendStatus("Disconnected");
      });
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">Capital Sagar</div>

        <nav>
          <a href="#home">Home</a>
          <a href="#hotels">Hotels</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <button className="login-button">Login</button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">WELCOME TO CAPITAL SAGAR</p>

            <h1>Find Your Perfect Stay</h1>

            <p className="hero-text">
              Discover comfortable stays and memorable experiences with
              Capital Sagar.
            </p>

            <button className="primary-button">
              Explore Hotels
            </button>
          </div>
        </section>

        <section className="search-section">
          <div className="search-box">
            <div>
              <label>Location</label>
              <input type="text" placeholder="Where are you going?" />
            </div>

            <div>
              <label>Check-in</label>
              <input type="date" />
            </div>

            <div>
              <label>Check-out</label>
              <input type="date" />
            </div>

            <div>
              <label>Guests</label>
              <input type="number" min="1" defaultValue="1" />
            </div>

            <button className="search-button">Search</button>
          </div>
        </section>

        <section className="features" id="hotels">
          <div className="section-heading">
            <p className="eyebrow">CAPITAL SAGAR</p>
            <h2>Everything you need for a comfortable stay</h2>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <h3>Comfortable Rooms</h3>
              <p>
                Enjoy thoughtfully designed rooms for short and extended
                stays.
              </p>
            </div>

            <div className="feature-card">
              <h3>Easy Booking</h3>
              <p>
                Find your stay and manage your reservation through one
                simple platform.
              </p>
            </div>

            <div className="feature-card">
              <h3>Reliable Service</h3>
              <p>
                A simple hotel experience focused on comfort and
                convenience.
              </p>
            </div>
          </div>
        </section>

        <section className="status-section" id="about">
          <h2>System Status</h2>

          <p>
            Backend:{" "}
            <strong className={backendStatus === "Connected" ? "online" : ""}>
              {backendStatus}
            </strong>
          </p>

          <p>Users available from database: {users.length}</p>
        </section>
      </main>

      <footer id="contact">
        <p>© 2026 Capital Sagar. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;