import React, { useState, useEffect } from "react";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import filterGames from "./utils/filterGames";

// Components
import Games from "./components/Games";
import { Modal } from "./components/Modal";
import Login from "./components/Login";

function App() {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({
    players: "",
    playtime: "",
    age: "",
    categories: [],
    mechanics: [],
  });

  // Get authentication state from context
  // isLoading: true while checking session on app load
  // user: the logged-in user object (null if not logged in)
  // logout: function to logout the user
  const { isLoading, user, logout } = useAuth();

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/");
      if (response.status === 401) {
        // Session expired or not found — log out so the user can re-authenticate
        logout();
        return;
      }
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setGames(data);
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  };

  useEffect(() => {
    // Only fetch games if user is logged in
    if (user) {
      fetchGames();
    }
  }, [user]);

  // While checking if user is logged in, show loading state
  if (isLoading) {
    return (
      <div className="App">
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, show login page
  if (!user) {
    return <Login />;
  }

  // If logged in, show the main app
  const filteredGames = filterGames(games, filters);

  return (
    <div className="App">
      <div className="container text-white p-3 mb-3">
        <div className="bg-success text-white p-3 mb-3 rounded d-flex justify-content-between align-items-center">
          <h1 className="mb-0">Table Top Games</h1>
          <div className="d-flex align-items-center gap-3">
            <span className="user-info">Welcome, {user.username}!</span>
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="text-success mb-3 rounded d-flex align-items-center gap-3 flex-wrap">
          <h2 className="mb-0">What's in your collection?</h2>
          <button
            type="button"
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#addGameModal"
          >
            Add Game
          </button>
        </div>
      </div>
      <div className="container">
        {games.length === 0 ? (
          <div className="empty-collection-message text-center" role="alert">
            <h4>Your collection is empty!</h4>
            <p>Click the "Add Game" button above to get started.</p>
          </div>
        ) : (
          <Games
            games={filteredGames}
            filters={filters}
            setFilters={setFilters}
          />
        )}
      </div>
      <Modal onGameAdded={fetchGames} />
    </div>
  );
}

export default App;
