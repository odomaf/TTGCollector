import React from "react";

export default function Games({ games }) {
  const loading = false; // No loading since data comes from parent
  const error = null;

  if (loading) {
    return <div>Loading games...</div>;
  }
  if (error) {
    return <div>Error loading games: {error.message}</div>;
  }
  return (
    <div>
      <h2>Your Game Collection</h2>
      {games.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <div className="row">
          {games.map((game) => (
            <div key={game.id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{game.name}</h5>
                  <p className="card-text">
                    <strong>Players:</strong> {game.min_players} -{" "}
                    {game.max_players}
                  </p>
                  <p className="card-text">
                    <strong>Play Time:</strong> {game.play_time} minutes
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
