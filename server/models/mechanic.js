const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// Mechanic model represents game mechanics like "Dice Rolling", "Worker Placement", "Area Control"
// Mechanics are linked to games through the game_mechanics join table
// A single mechanic can belong to many games
class Mechanic extends Model {}

// Mechanic.init() defines the schema/structure of the Mechanic model
Mechanic.init(
  {
    // id: Auto-incrementing primary key (unique identifier for each mechanic)
    // - GENERATED ALWAYS AS IDENTITY in schema.sql creates this automatically
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // mechanic: The name of the game mechanic (e.g., "Dice Rolling", "Worker Placement", "Area Control")
    // - allowNull: false means every mechanic must have a name
    // - unique: true ensures we don't have duplicate mechanics
    mechanic: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize, // Pass the sequelize connection instance
    timestamps: false, // Don't track created_at/updated_at (mechanics are static data)
    freezeTableName: true, // Use the exact tableName below (don't pluralize it)
    modelName: "mechanic", // Model name in camelCase (used in associations)
    tableName: "mechanics", // The actual table name in the database (matches schema.sql)
  },
);

// Associations are defined in models/index.js
// Mechanic has many Games (through game_mechanics)

module.exports = Mechanic;
