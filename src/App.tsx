import { useEffect, useState } from "react";
import userService, { User } from "./services/user-service";
import { CanceledError } from "./services/api-client";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = userService.getAll<User>();

    request
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError((err as Error).message);
        setLoading(false);
      });

    return () => cancel();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Users</h1>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
      <ul className="list-group">
        {users.map((user) => (
          <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">{user.name}</h5>
              <small className="text-muted">{user.email}</small>
            </div>
            <span className="badge bg-primary rounded-pill">Org: {user.organizacion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
