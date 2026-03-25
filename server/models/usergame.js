const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// UserGame is a "through" or "join" table that connects Users to Games
// It tracks which games belong to which users (user's game collection)
// Example: User 1 owns Game 5 and Game 7 (creates two rows in this table)
class UserGame extends Model {}

UserGame.init(
  {
    // id: Auto-incrementing primary key for this relationship record
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // user_id: Foreign key linking to the users table
    // references tells Sequelize: this column points to users.id
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // The table this references (matches tableName in User model)
        key: "id", // The column in that table (the user's ID)
      },
    },
    // game_id: Foreign key linking to the games table
    // references tells Sequelize: this column points to games.id
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "games", // The table this references (matches tableName in Game model)
        key: "id", // The column in that table (the game's ID)
      },
    },
  },
  {
    sequelize, // Pass the sequelize connection instance
    timestamps: true, // Enable timestamps
    createdAt: "created_at", // When the user added this game to their collection
    updatedAt: false, // Don't track when it was last updated (once added, it doesn't change)
    freezeTableName: true, // Use exact tableName (don't pluralize)
    modelName: "userGame", // Model name in camelCase (used in associations)
    tableName: "user_games", // The actual table name in the database (matches schema.sql)
  },
);

module.exports = UserGame;
