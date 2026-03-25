import React, { useState } from "react";

const DEFAULT_FILTERS = {
  players: "",
  playtime: "",
  age: "",
  categories: [],
  mechanics: [],
};

export default function FiltersPanel({
  filters,
  setFilters,
  categoryOptions,
  mechanicOptions,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNumberChange = (key) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  const handleToggleListValue = (key, value) => (event) => {
    setFilters((prev) => {
      const currentValues = prev[key] || [];
      const nextValues = event.target.checked
        ? [...currentValues, value]
        : currentValues.filter((item) => item !== value);

      return {
        ...prev,
        [key]: nextValues,
      };
    });
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h3 className="h5 mb-0">Filters</h3>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-success btn-sm"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="gamesFilterPanel"
            >
              {isOpen ? "Hide filters" : "Show filters"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        </div>

        {isOpen && (
          <div id="gamesFilterPanel" className="row g-3">
            <div className="col-12 col-md-4">
              <label htmlFor="playersFilter" className="form-label">
                Show games playable by X players
              </label>
              <input
                id="playersFilter"
                type="number"
                min="1"
                className="form-control"
                value={filters.players}
                onChange={handleNumberChange("players")}
              />
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="playtimeFilter" className="form-label">
                Show games under X minutes
              </label>
              <input
                id="playtimeFilter"
                type="number"
                min="1"
                className="form-control"
                value={filters.playtime}
                onChange={handleNumberChange("playtime")}
              />
            </div>

            <div className="col-12 col-md-4">
              <label htmlFor="ageFilter" className="form-label">
                Show games for age X+
              </label>
              <input
                id="ageFilter"
                type="number"
                min="1"
                className="form-control"
                value={filters.age}
                onChange={handleNumberChange("age")}
              />
            </div>

            <div className="col-12 col-lg-6">
              <fieldset className="border rounded p-3 h-100">
                <legend className="float-none w-auto px-2 fs-6 mb-2">
                  Categories
                </legend>
                <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                  {categoryOptions.map((category) => (
                    <div className="form-check" key={category.value}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`category-${category.value}`}
                        checked={filters.categories.includes(category.value)}
                        onChange={handleToggleListValue(
                          "categories",
                          category.value,
                        )}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`category-${category.value}`}
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="col-12 col-lg-6">
              <fieldset className="border rounded p-3 h-100">
                <legend className="float-none w-auto px-2 fs-6 mb-2">
                  Mechanics
                </legend>
                <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                  {mechanicOptions.map((mechanic) => (
                    <div className="form-check" key={mechanic.value}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`mechanic-${mechanic.value}`}
                        checked={filters.mechanics.includes(mechanic.value)}
                        onChange={handleToggleListValue(
                          "mechanics",
                          mechanic.value,
                        )}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`mechanic-${mechanic.value}`}
                      >
                        {mechanic.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
