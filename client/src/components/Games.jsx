import React, { useState, useEffect } from "react";

export default function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the list of games from the API
    const fetchGames = async () => {
      try {
        const response = await fetch("/api/");
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

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
