const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// User model represents the users table in the database
// Users have email, username, and hashed password fields
class User extends Model {}

// User.init() defines the schema/structure of the User model
// First parameter: object defining all columns and their properties
// Second parameter: configuration options for the model
User.init(
  {
    // id: Auto-incrementing primary key (unique identifier for each user)
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // email: User's email address
    // - unique: true ensures no two users can have the same email
    // - validate: {isEmail: true} checks that the value is a valid email format
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // username: User's display name
    // - unique: true ensures no two users can have the same username
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // password: Hashed password (NEVER store plain text passwords)
    // This will be hashed with bcrypt before saving to the database
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Configuration options for the model:
    sequelize, // Pass the sequelize connection instance (tells model how to connect to DB)
    timestamps: true, // Automatically create created_at and updated_at fields
    createdAt: "created_at", // Column name for when user was created
    updatedAt: "updated_at", // Column name for when user was last updated
    freezeTableName: true, // Use the exact tableName below (don't pluralize it)
    modelName: "user", // The model name in camelCase (used in associations)
    tableName: "users", // The actual table name in the database (matches schema.sql)
  },
);

module.exports = User;
