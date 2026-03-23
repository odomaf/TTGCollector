import React from "react";
import "./App.css";

//components
import { AddGame } from "./components/AddGame";
import Games from "./components/Games";
import { Modal } from "./components/Modal";

function App() {
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
        <Games />
      </div>

      <Modal />
    </div>
  );
}

export default App;