import React from "react";
import "./App.css";

//components
import { AddGame } from "./components/AddGame";
import Games from "./components/Games";
import { Modal } from "./components/Modal";

function App() {
  return (
    <div className="App">
      <h1>Welcome to TTG Collector</h1>

      <div className="mb-3">
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addGameModal"
        >
          Add Game
        </button>
      </div>

      <Games />

      <Modal />
    </div>
  );
}

export default App;