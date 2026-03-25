const Game = require("./game");
const Category = require("./category");
const Mechanic = require("./mechanic");
const User = require("./user");
const UserGame = require("./usergame");

// ==================== ASSOCIATIONS ====================
// Associations define the relationships between models
// belongsToMany() creates a many-to-many relationship (games have many categories, categories have many games)
// The 'through' option specifies which table connects them (the join table)
// ========================================================

// Games can have multiple categories, and categories can belong to multiple games
Game.belongsToMany(Category, {
  through: "game_categories", // The join table that connects games to categories
  foreignKey: "game_id", // Column in game_categories that references games
  otherKey: "category_id", // Column in game_categories that references categories
  timestamps: false, // Don't track when this relationship was created
});

// Reverse: Categories can have multiple games
Category.belongsToMany(Game, {
  through: "game_categories",
  foreignKey: "category_id",
  otherKey: "game_id",
  timestamps: false,
});

// Games can have multiple mechanics, and mechanics can belong to multiple games
Game.belongsToMany(Mechanic, {
  through: "game_mechanics", // The join table that connects games to mechanics
  foreignKey: "game_id", // Column in game_mechanics that references games
  otherKey: "mechanic_id", // Column in game_mechanics that references mechanics
  timestamps: false, // Don't track when this relationship was created
});

// Reverse: Mechanics can have multiple games
Mechanic.belongsToMany(Game, {
  through: "game_mechanics",
  foreignKey: "mechanic_id",
  otherKey: "game_id",
  timestamps: false,
});

// ==================== USER & GAME ASSOCIATIONS ====================
// Users can have multiple games (their game collection)
// Games can belong to multiple users (each user has their own copy/collection entry)
// Example: User 1 owns Game "Catan", User 2 also owns Game "Catan"
// ===================================================================

// Users can have multiple games in their collection
User.belongsToMany(Game, {
  through: "user_games", // Use the table name directly
  foreignKey: "user_id", // Column in user_games that references users
  otherKey: "game_id", // Column in user_games that references games
  as: "Games", // Alias for the association (user.Games)
});

// Reverse: Games can belong to multiple users' collections
Game.belongsToMany(User, {
  through: "user_games",
  foreignKey: "game_id",
  otherKey: "user_id",
  as: "Users", // Alias for the association (game.Users)
});

module.exports = { Game, Category, Mechanic, User, UserGame };
