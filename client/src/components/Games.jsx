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
      {games.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-3 games-grid">
          {games.map((game) => (
            <div key={game.id} className="col mb-0">
              <div className="card game-card shadow">
                {game.thumbnail ? (
                  <img
                    src={game.thumbnail}
                    className="card-img-top game-card-img-top"
                    alt={game.name}
                  />
                ) : (
                  <div className="card-img-top game-card-img-top bg-light border d-flex align-items-center justify-content-center">
                    <span className="text-muted">No image</span>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{game.name}</h5>
                  <p className="card-text">
                    Players: {game.min_players ?? "-"}
                    {game.min_players !== game.max_players
                      ? `-${game.max_players ?? "-"}`
                      : ""}
                  </p>
                  <p className="card-text">
                    Play Time: {game.minplaytime ?? "-"}
                    {game.minplaytime !== game.maxplaytime
                      ? `-${game.maxplaytime ?? "-"}`
                      : ""}
                  </p>
                  <p className="card-text">Min Age: {game.minage ?? "-"}+</p>
                  <p className="card-text mb-0">
                    {game.bgg_id ? (
                      <a
                        href={`https://boardgamegeek.com/boardgame/${game.bgg_id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        See on Board Game Geek
                      </a>
                    ) : (
                      "-"
                    )}
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
