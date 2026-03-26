import React, { useState, useEffect } from "react";
import Select from "react-select";

export const AddGame = ({ onGameAdded, setCanSubmit }) => {
  const [formState, setFormState] = useState({
    gameName: "",
    min_players: "",
    max_players: "",
    thumbnail: "",
    description: "",
    published: "",
    bgg_id: "",
    minplaytime: "",
    maxplaytime: "",
    minage: "",
  });

  const {
    gameName,
    min_players,
    max_players,
    thumbnail,
    description,
    published,
    bgg_id,
    minplaytime,
    maxplaytime,
    minage,
  } = formState;
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [searchOffset, setSearchOffset] = useState(0);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [manualAddEnabled, setManualAddEnabled] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [mechanicOptions, setMechanicOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMechanics, setSelectedMechanics] = useState([]);

  const resetForm = () => {
    setFormState({
      gameName: "",
      min_players: "",
      max_players: "",
      thumbnail: "",
      description: "",
      published: "",
      bgg_id: "",
      minplaytime: "",
      maxplaytime: "",
      minage: "",
    });
    setSearchResults([]);
    setSearchError(null);
    setSubmitError(null);
    setSearchOffset(0);
    setHasMoreResults(false);
    setSelectedGame(null);
    setManualAddEnabled(false);
    setNoResults(false);
    setSelectedCategories([]);
    setSelectedMechanics([]);
  };

  const canSubmit =
    gameName.trim().length > 0 &&
    (Boolean(selectedGame) || manualAddEnabled);

  useEffect(() => {
    const modalEl = document.getElementById("addGameModal");
    if (!modalEl) return;
    modalEl.addEventListener("hidden.bs.modal", resetForm);
    return () => modalEl.removeEventListener("hidden.bs.modal", resetForm);
  }, []);

  useEffect(() => {
    if (typeof setCanSubmit === "function") {
      setCanSubmit(canSubmit);
    }
  }, [canSubmit, setCanSubmit]);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/mechanics").then((r) => r.json()),
    ])
      .then(([cats, mechs]) => {
        setCategoryOptions(
          cats.map((c) => ({ value: c.category, label: c.category })),
        );
        setMechanicOptions(
          mechs.map((m) => ({ value: m.mechanic, label: m.mechanic })),
        );
      })
      .catch(console.error);
  }, []);

  const runBGGSearch = async ({ offset = 0, append = false } = {}) => {
    setSearching(true);
    setSearchError(null);
    try {
      const response = await fetch(
        `/api/bgg/search/${encodeURIComponent(gameName)}?offset=${offset}&limit=20`,
      );
      if (!response.ok) {
        throw new Error(`BGG search failed: ${response.status}`);
      }

      const payload = await response.json();
      const resultList = Array.isArray(payload)
        ? payload
        : payload.results || [];
      const nextOffset = Array.isArray(payload)
        ? offset + resultList.length
        : payload.nextOffset || offset + resultList.length;
      const hasMore = Array.isArray(payload)
        ? resultList.length === 20
        : Boolean(payload.hasMore);

      setSelectedGame(null);
      setSearchResults((prev) =>
        append ? [...prev, ...resultList] : resultList,
      );
      setSearchOffset(nextOffset);
      setHasMoreResults(hasMore);
      if (!append) setNoResults(resultList.length === 0);
    } catch (error) {
      console.error("BGG search error:", error);
      setSearchError(error.message);
    } finally {
      setSearching(false);
    }
  };

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
    setSubmitError(null);
    console.log("Form state on submit:", formState);
    if (!gameName) {
      console.error("Game name is required");
      return;
    } else {
      try {
        const body = JSON.stringify({
          name: gameName,
          min_players: min_players ? parseInt(min_players, 10) : null,
          max_players: max_players ? parseInt(max_players, 10) : null,
          thumbnail,
          description,
          published,
          bgg_id: bgg_id ? parseInt(bgg_id, 10) : null,
          minplaytime: minplaytime ? parseInt(minplaytime, 10) : null,
          maxplaytime: maxplaytime ? parseInt(maxplaytime, 10) : null,
          minage: minage ? parseInt(minage, 10) : null,
          categories: selectedCategories.map((c) => c.value),
          mechanics: selectedMechanics.map((m) => m.value),
        });
        console.log("Request body:", body);
        const response = await fetch("/api/addGame", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
        });
        if (!response.ok) {
          let message = `Failed to add game (${response.status})`;
          try {
            const errorPayload = await response.json();
            if (errorPayload?.error) {
              message = errorPayload.error;
            }
          } catch (_err) {
            // Keep fallback message when response is not JSON.
          }
          setSubmitError(message);
          return;
        }
        if (response.ok) {
          // Close modal
          document.querySelector("#addGameModal .btn-close").click();
          // Refresh games list
          onGameAdded();
          // Reset form state for next add
          setSelectedGame(null);
          setSearchResults([]);
          setSearchError(null);
          setFormState({
            gameName: "",
            min_players: "",
            max_players: "",
            thumbnail: "",
            description: "",
            published: "",
            bgg_id: "",
            minplaytime: "",
            maxplaytime: "",
            minage: "",
          });
        }
        console.log("Game added:", response);
      } catch (error) {
        console.error("Error adding game:", error);
        setSubmitError("Unable to add game right now. Please try again.");
      }
    }
  };

  return (
    <div className="row g-3 align-items-center container">
      <form
        id="addGameForm"
        className="row g-3 align-items-end"
        onSubmit={handleSubmit}
      >
        <div className="col-12">
          <div className="row g-2 align-items-center">
            <div className="col-md-2">
              <label htmlFor="gameName" className="form-label mb-0">
                Game Name
              </label>
            </div>
            <div className="col-md-6">
              <input
                type="text"
                id="gameName"
                name="gameName"
                value={gameName}
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <button
                type="button"
                className="btn btn-success w-100"
                disabled={!gameName || searching}
                onClick={() => runBGGSearch({ offset: 0, append: false })}
              >
                {searching ? "Searching..." : "Search BoardGameGeek"}
              </button>
            </div>
          </div>
        </div>

        {searchError && (
          <div className="col-12">
            <div className="alert alert-danger">{searchError}</div>
          </div>
        )}

        {submitError && (
          <div className="col-12">
            <div className="alert alert-danger mb-0">{submitError}</div>
          </div>
        )}

        {noResults && !manualAddEnabled && (
          <div className="col-12">
            <div className="alert alert-warning d-flex align-items-center gap-3 mb-0">
              <span>
                No results found on BoardGameGeek. Would you like to add this
                game manually?
              </span>
              <button
                type="button"
                className="btn btn-success btn-sm ms-auto"
                onClick={() => setManualAddEnabled(true)}
              >
                Yes, add manually
              </button>
            </div>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="col-12">
            <h6>Search results</h6>
            <ul className="list-group">
              {searchResults.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item list-group-item-action d-flex align-items-center gap-3 addgame-search-result"
                  onClick={() => {
                    setSelectedGame(item);
                    setSearchResults([]);
                    const bggCats = item.boardgamecategory || [];
                    const bggMechs = item.boardgamemechanic || [];
                    setSelectedCategories(
                      categoryOptions.filter((o) => bggCats.includes(o.value)),
                    );
                    setSelectedMechanics(
                      mechanicOptions.filter((o) => bggMechs.includes(o.value)),
                    );
                    setFormState((prev) => ({
                      ...prev,
                      gameName: item.name || "",
                      min_players: item.minplayers || "",
                      max_players: item.maxplayers || "",
                      thumbnail: item.thumbnail || "",
                      description: item.description || "",
                      published: item.yearpublished || "",
                      bgg_id: item.id || "",
                      minplaytime: item.minplaytime || "",
                      maxplaytime: item.maxplaytime || "",
                      minage: item.minage || "",
                    }));
                  }}
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="addgame-search-thumbnail"
                    />
                  ) : (
                    <div className="bg-light border addgame-search-thumbnail" />
                  )}
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>

            {hasMoreResults && (
              <button
                type="button"
                className="btn btn-outline-success mt-2"
                disabled={searching}
                onClick={() =>
                  runBGGSearch({ offset: searchOffset, append: true })
                }
              >
                {searching ? "Loading..." : "See more"}
              </button>
            )}
          </div>
        )}

        {selectedGame && (
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-start gap-3 mb-3">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={gameName}
                      className="addgame-selected-thumbnail"
                    />
                  ) : (
                    <div className="bg-light border addgame-selected-thumbnail" />
                  )}

                  <div className="addgame-selected-info flex-grow-1">
                    <h4 className="mb-1 fw-bold">
                      {gameName}
                      {published ? ` (${published})` : ""}
                    </h4>

                    <p className="mb-1">
                      <strong>Player Count:</strong> {min_players || "-"}-
                      {max_players || "-"}
                    </p>
                    <p className="mb-1">
                      <strong>Play Time:</strong> {minplaytime || "-"}-
                      {maxplaytime || "-"}
                    </p>
                    <p className="mb-1">
                      <strong>Min Age:</strong> {minage || "-"}+
                    </p>
                    <p className="mb-1">
                      {bgg_id ? (
                        <a
                          href={`https://boardgamegeek.com/boardgame/${bgg_id}`}
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

                <div className="row g-2">
                  <div className="col-12">
                    <p className="mb-1 addgame-description">
                      {description || "-"}
                    </p>
                  </div>
                  <div className="col-12">
                    <label className="form-label mb-1">
                      <strong>Game Type</strong>
                    </label>
                    <Select
                      isMulti
                      options={categoryOptions}
                      value={selectedCategories}
                      onChange={setSelectedCategories}
                      placeholder="Select categories..."
                      classNamePrefix="react-select"
                    />
                  </div>
                  <div className="col-12 mt-2">
                    <label className="form-label mb-1">
                      <strong>Primary Mechanics</strong>
                    </label>
                    <Select
                      isMulti
                      options={mechanicOptions}
                      value={selectedMechanics}
                      onChange={setSelectedMechanics}
                      placeholder="Select mechanics..."
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {manualAddEnabled && (
          <div className="col-12">
            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label">Min Players</label>
                <input
                  type="number"
                  className="form-control"
                  name="min_players"
                  value={min_players}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Max Players</label>
                <input
                  type="number"
                  className="form-control"
                  name="max_players"
                  value={max_players}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Min Age</label>
                <input
                  type="number"
                  className="form-control"
                  name="minage"
                  value={minage}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Min Playtime</label>
                <input
                  type="number"
                  className="form-control"
                  name="minplaytime"
                  value={minplaytime}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Max Playtime</label>
                <input
                  type="number"
                  className="form-control"
                  name="maxplaytime"
                  value={maxplaytime}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="description"
                  value={description}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <label className="form-label">Game Type</label>
                <Select
                  isMulti
                  options={categoryOptions}
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="Select categories..."
                  classNamePrefix="react-select"
                />
              </div>
              <div className="col-12">
                <label className="form-label">Primary Mechanics</label>
                <Select
                  isMulti
                  options={mechanicOptions}
                  value={selectedMechanics}
                  onChange={setSelectedMechanics}
                  placeholder="Select mechanics..."
                  classNamePrefix="react-select"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
