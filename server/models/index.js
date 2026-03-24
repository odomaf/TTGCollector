const Game = require('./game');
const Category = require('./category');
const Mechanic = require('./mechanic');

// Define associations
Game.belongsToMany(Category, {
  through: "game_categories",
  foreignKey: "game_id",
  otherKey: "category_id",
  timestamps: false,
});

Category.belongsToMany(Game, {
  through: "game_categories",
  foreignKey: "category_id",
  otherKey: "game_id",
  timestamps: false,
});

Game.belongsToMany(Mechanic, {
  through: "game_mechanics",
  foreignKey: "game_id",
  otherKey: "mechanic_id",
  timestamps: false,
});

Mechanic.belongsToMany(Game, {
  through: "game_mechanics",
  foreignKey: "mechanic_id",
  otherKey: "game_id",
  timestamps: false,
});

module.exports = { Game, Category, Mechanic };