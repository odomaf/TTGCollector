import React from "react";

export const AddGame = () => {
  
  return (
    <div className="container">
      <h2>Add a New Game</h2>
      <form>
        <div>
          <label for="name" class="form-label"> Name: </label>
          <input type="text" name="name" id="name"  />
        </div>
        <div>
          <label for="min_players" class="form-label"> Min Players: </label>
          <input type="number" name="min_players" id="min_players"  />
        </div>
        <div>
          <label for="max_players" class="form-label"> Max Players: </label>
          <input type="number" name="max_players" id="max_players"  />
        </div>
      </form>
    </div>
  );
};
