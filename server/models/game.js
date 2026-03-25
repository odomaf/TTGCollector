const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// Game model represents a board game in the games table
// Each game contains metadata fetched from BoardGameGeek API
// Games can belong to many users (through user_games join table)
// Games can have many categories and mechanics (through join tables)
class Game extends Model {}

// Game.init() defines the schema/structure of the Game model
Game.init(
  {
    // id: Auto-incrementing primary key (unique identifier for each game)
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // name: The title/name of the game
    // - allowNull: false means every game must have a name
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // min_players: Minimum number of players needed to play the game
    min_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // max_players: Maximum number of players that can play the game
    max_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // thumbnail: URL to a thumbnail image of the game (from BGG API)
    thumbnail: {
      type: DataTypes.TEXT,
    },
    // description: Full description/rules summary of the game
    description: {
      type: DataTypes.TEXT,
    },
    // published: Year or date the game was published
    published: {
      type: DataTypes.TEXT,
    },
    // bgg_id: BoardGameGeek ID - unique identifier from BGG API
    // - unique: true ensures we don't duplicate the same BGG game
    bgg_id: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    // minplaytime: Minimum time (in minutes) to play the game
    minplaytime: {
      type: DataTypes.INTEGER,
    },
    // maxplaytime: Maximum time (in minutes) to play the game
    maxplaytime: {
      type: DataTypes.INTEGER,
    },
    // minage: Minimum age recommended to play the game
    minage: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize, // Pass the sequelize connection instance
    timestamps: false, // Don't track created_at/updated_at for games (static data from BGG)
    freezeTableName: true, // Use the exact tableName below (don't pluralize it)
    modelName: "game", // Model name in camelCase (used in associations)
    tableName: "games", // The actual table name in the database (matches schema.sql)
  },
);

// Associations are defined in models/index.js
// Game has many Categories (through game_categories)
// Game has many Mechanics (through game_mechanics)
// Game has many Users (through user_games)

module.exports = Game;
