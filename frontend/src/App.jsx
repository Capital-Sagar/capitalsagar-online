import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("Loading users...");

  useEffect(() => {
    fetch("/api/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setMessage(`Users loaded successfully: ${data.length}`);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Could not load users");
      });
  }, []);

  return (
    <div>
      <h1>Capital Sagar</h1>

      <p>{message}</p>

      {users.map((user) => (
        <div key={user.id}>
          <p>
            {user.fullname} — {user.email}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;