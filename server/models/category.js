const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// Category model represents game categories/types like "Strategy", "Party", "Cooperative"
// Categories are linked to games through the game_categories join table
// A single category can belong to many games
class Category extends Model {}

// Category.init() defines the schema/structure of the Category model
Category.init(
  {
    // id: Auto-incrementing primary key (unique identifier for each category)
    // - GENERATED ALWAYS AS IDENTITY in schema.sql creates this automatically
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // category: The name of the category (e.g., "Strategy", "Party", "Cooperative")
    // - allowNull: false means every category must have a name
    // - unique: true ensures we don't have duplicate categories
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize, // Pass the sequelize connection instance
    timestamps: false, // Don't track created_at/updated_at (categories are static data)
    freezeTableName: true, // Use the exact tableName below (don't pluralize it)
    modelName: "category", // Model name in camelCase (used in associations)
    tableName: "categories", // The actual table name in the database (matches schema.sql)
  },
);

// Associations are defined in models/index.js
// Category has many Games (through game_categories)

module.exports = Category;
