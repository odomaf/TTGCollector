import React, {useState, useEffect} from "react";

export default function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the list of games from the API
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching games:', err);
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
      <h2>Games List</h2>
      {games.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <strong>{game.name}</strong>
              <p>Players: {game.min_players} - {game.max_players}</p>
              <p>Play Time: {game.play_time} minutes</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}