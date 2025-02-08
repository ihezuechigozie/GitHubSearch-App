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
    
        const userDetails = await Promise.all(
          data.items.slice(0, 5).map(async (user) => {
            const userResponse = await fetch(user.url);
            const userData = await userResponse.json();
            
            
            const starredResponse = await fetch(`${user.url}/starred`);
            const starredData = await starredResponse.json();
            
            return { 
              ...userData, 
              starred_count: starredData.length 
            };
          })
        );
        
        setUsers(userDetails);
      }
    } catch (err) {
      setError(err.message);
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
          onKeyPress={(e) => e.key === "Enter" && fetchUsers()}
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
                  <h5 className="card-title">{user.name || user.login}</h5>
                  <p className="card-text">{user.bio || "No bio available"}</p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><strong>Repositories:</strong> {user.public_repos}</li>
                    <li className="list-group-item"><strong>Followers:</strong> {user.followers}</li>
                    <li className="list-group-item"><strong>Following:</strong> {user.following}</li>
                    <li className="list-group-item"><strong>Stars:</strong> {user.starred_count}</li>
                    <li className="list-group-item">
                      <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                        View Profile
                      </a>
                    </li>
                  </ul>
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
