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
  const isDesktop =
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 992px)").matches;
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount =
    (filters.players ? 1 : 0) +
    (filters.playtime ? 1 : 0) +
    (filters.age ? 1 : 0) +
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.mechanics.length > 0 ? 1 : 0);

  const shouldShowFilters = isDesktop || isOpen;

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
    <div className="card mb-2 shadow-sm filter-panel">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-1 mb-2">
          <div className="d-flex align-items-center gap-1 filter-panel-header">
            <h3 className="mb-0 filter-panel-title">Filter Your Games</h3>
            {!isDesktop && (
              <button
                type="button"
                className="btn btn-link btn-sm filter-panel-toggle"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-controls="gamesFilterPanel"
                aria-label={isOpen ? "Collapse filters" : "Expand filters"}
              >
                <span className="filter-panel-toggle-icon" aria-hidden="true">
                  {isOpen ? "▴" : "▾"}
                </span>
              </button>
            )}
          </div>

          {!isDesktop && !isOpen && (
            <button
              type="button"
              className="btn btn-outline-success btn-sm"
              onClick={() => setIsOpen(true)}
            >
              Show Filters
              {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>
          )}
        </div>

        {shouldShowFilters && (
          <div id="gamesFilterPanel" className="row g-2">
            <div className="col-12 d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>

            <div className="col-12">
              <div className="d-flex align-items-center gap-2 numeric-filter-row">
                <label htmlFor="playersFilter" className="form-label mb-0">
                  Player Count
                </label>
                <input
                  id="playersFilter"
                  type="number"
                  min="1"
                  className="form-control numeric-filter-input"
                  value={filters.players}
                  onChange={handleNumberChange("players")}
                />
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex align-items-center gap-2 numeric-filter-row">
                <label htmlFor="playtimeFilter" className="form-label mb-0">
                  Duration
                </label>
                <input
                  id="playtimeFilter"
                  type="number"
                  min="1"
                  className="form-control numeric-filter-input"
                  value={filters.playtime}
                  onChange={handleNumberChange("playtime")}
                />
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex align-items-center gap-2 numeric-filter-row">
                <label htmlFor="ageFilter" className="form-label mb-0">
                  Player Age
                </label>
                <input
                  id="ageFilter"
                  type="number"
                  min="1"
                  className="form-control numeric-filter-input"
                  value={filters.age}
                  onChange={handleNumberChange("age")}
                />
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <fieldset className="border rounded p-2 h-100">
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
              <fieldset className="border rounded p-2 h-100">
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
