import React from "react";
import { useState } from "react";
import { Modal } from "bootstrap";

export const AddGame = ({ onGameAdded }) => {
  const [formState, setFormState] = useState({
    gameName: "",
    min_players: 0,
    max_players: 0,
    play_time: 0,
  });

  const { gameName, min_players, max_players, play_time } = formState;

  const handleChange = (event) => {
    const { name, value } = event.target;
    //console.log(`Input changed: ${name} = ${value}`);
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form state on submit:", formState);
    if (!gameName) {
      console.error("Game name is required");
      return;
    } else {
      try {
        const body = JSON.stringify({
          name: gameName,
          min_players: min_players,
          max_players: max_players,
          play_time: play_time,
        });
        console.log("Request body:", body);
        const response = await fetch("/api/addGame", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
        });
        if (response.ok) {
          // Close modal
          document.querySelector('#addGameModal .btn-close').click();
          // Refresh games list
          onGameAdded();
        }
        console.log("Game added:", response);
      } catch (error) {
        console.error("Error adding game:", error);
      }
    }
  };

  const searchBGG = async (query) => {
    const response = await fetch(`/api/bgg/search/${query}`);
    const data = await response.json();
    // Use data...
  };

  return (
    <div className="row g-3 align-items-center container">
      <form id="addGameForm" onSubmit={handleSubmit}>
        <div className="col-auto">
          <label htmlFor="gameName" className="form-label">
            Game Name
          </label>
        </div>
        <div className="col-auto">
          <input
            type="text"
            id="gameName"
            name="gameName"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="col-auto">
          <label htmlFor="min_players" className="form-label">
            Min Players
          </label>
        </div>
        <div className="col-auto">
          <input
            type="number"
            id="min_players"
            name="min_players"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="col-auto">
          <label htmlFor="max_players" className="form-label">
            Max Players
          </label>
        </div>
        <div className="col-auto">
          <input
            type="number"
            id="max_players"
            name="max_players"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="col-auto">
          <label htmlFor="play_time" className="form-label">
            Play Time (minutes)
          </label>
        </div>
        <div className="col-auto">
          <input
            type="number"
            id="play_time"
            name="play_time"
            className="form-control"
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
};
