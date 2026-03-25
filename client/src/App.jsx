import React, { useState, useEffect } from "react";
import "./App.css";

//components
import Games from "./components/Games";
import { Modal } from "./components/Modal";

function App() {
  const [games, setGames] = useState([]);

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/");
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
    fetchGames();
  }, []);

  return (
    <div className="App">
      <div className="container text-white p-3 mb-3">
        <div className="bg-success text-white p-3 mb-3 rounded">
          <h1>Table Top Games</h1>
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
        <Games games={games} />
      </div>
      <Modal onGameAdded={fetchGames} />
    </div>
  );
}

export default App;
