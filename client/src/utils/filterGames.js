// Normalize text values once so category/mechanic matching is case-insensitive.
const toLowerSet = (values = []) =>
	new Set(values.map((value) => String(value).toLowerCase()));

// Treat null/undefined/empty-string filter inputs as "inactive" filters.
const isEmptyFilterValue = (value) =>
	value == null || (typeof value === "string" && value.trim() === "");

// Support category values coming from either strings or Sequelize include objects.
const getCategoryName = (value) => {
	if (typeof value === "string") return value;
	if (value && typeof value === "object") return value.category || "";
	return "";
};

// Support mechanic values coming from either strings or Sequelize include objects.
const getMechanicName = (value) => {
	if (typeof value === "string") return value;
	if (value && typeof value === "object") return value.mechanic || "";
	return "";
};

// Return true when there is at least one shared value between the game and filter.
// If the user has not selected anything, this filter should not exclude the game.
const hasAnyMatch = (gameValues = [], selectedValues = []) => {
	if (!selectedValues.length) return true;

	const gameSet = toLowerSet(gameValues);
	return selectedValues.some((selected) =>
		gameSet.has(String(selected).toLowerCase())
	);
};

export default function filterGames(games = [], activeFilters = {}) {
	const {
		players,
		playtime,
		age,
		categories = [],
		mechanics = [],
	} = activeFilters;

	// Keep only games that pass every active filter.
	return games.filter((game) => {
		// Players filter: selected player count must fall in the game's supported range.
		const matchesPlayers =
			isEmptyFilterValue(players) ||
			(Number(game.min_players) <= Number(players) &&
				Number(players) <= Number(game.max_players));

		// Playtime filter: selected playtime must be between game min and max playtime.
		const matchesPlaytime =
			isEmptyFilterValue(playtime) ||
			(Number(game.minplaytime) <= Number(playtime) &&
				Number(playtime) <= Number(game.maxplaytime));

		// Age filter: game's minimum age must be less than or equal to selected age.
		const matchesAge =
			isEmptyFilterValue(age) || Number(game.minage) <= Number(age);

		// Categories/mechanics use "at least one overlap" logic.
		const matchesCategories = hasAnyMatch(
			(game.Categories || game.categories || []).map(getCategoryName),
			categories
		);
		const matchesMechanics = hasAnyMatch(
			(game.Mechanics || game.mechanics || []).map(getMechanicName),
			mechanics
		);

		return (
			matchesPlayers &&
			matchesPlaytime &&
			matchesAge &&
			matchesCategories &&
			matchesMechanics
		);
	});
}
