import React, { useState, useEffect } from "react";
import "./App.css";

//components
import { AddGame } from "./components/AddGame";
import Games from "./components/Games";
import { Modal } from "./components/Modal";

function App() {
  const [games, setGames] = useState([]);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setGames(data);
    } catch (err) {
      console.error('Error fetching games:', err);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="App">
      <div className="container bg-success text-white p-3 mb-3">
        <h1>Welcome to TTG Collector</h1>
      </div>

      <div className="mb-3 container">
        <button
          type="button"
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addGameModal"
        >
          Add Game
        </button>
      </div>

      <div className="container">
        <Games games={games} />
      </div>

      <Modal onGameAdded={fetchGames} />
    </div>
  );
}

export default App;