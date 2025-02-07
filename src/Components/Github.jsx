import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const GitHubSearch = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setError("");
    setUsers([]);

    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/search/users?q=${username}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      if (data.items.length === 0) {
        setError("No users found.");
      } else {
        setUsers(data.items);
      }
    } catch (err) {
      setError(err.message);
    }
  };

 
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchUsers();
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2>GitHub User Search</h2>

      <div className="input-group my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="btn btn-primary" onClick={fetchUsers}>
          Search
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {users.length > 0 && (
        <div className="row mt-3">
          {users.map((user) => (
            <div key={user.id} className="col-md-4 col-sm-6 mb-3">
              <div className="card shadow-sm">
                <img src={user.avatar_url} className="card-img-top" alt="Avatar" />
                <div className="card-body">
                  <h5 className="card-title">{user.login}</h5>
                  <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GitHubSearch;
