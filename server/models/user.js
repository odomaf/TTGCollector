const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
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

// ==================== PASSWORD HASHING HOOKS ====================
// Hooks automatically run before/after Sequelize operations
// These ensure passwords are ALWAYS hashed before being saved to the database
// ===================================================================

// beforeCreate Hook: Runs when a new User is created
// Automatically hashes the password before saving to database
User.beforeCreate(async (user) => {
  // Only hash if a password was provided
  if (user.password) {
    // bcrypt.hash(plainTextPassword, saltRounds)
    // saltRounds: 10 means 2^10 iterations (stronger = slower, but 10 is standard)
    // Returns: a hashed password string
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// beforeUpdate Hook: Runs when an existing User is updated
// Hashes the password again if it was changed
User.beforeUpdate(async (user) => {
  // Check if the password field was actually modified
  // If user only updated email/username, we don't want to re-hash the password
  // user.changed() returns an array of fields that were changed
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// ==================== INSTANCE METHOD ====================
// Instance methods run on individual user records
// This method is used during login to verify passwords
// ========================================================

// comparePassword: Compares a plain-text password with the hashed password in the database
// Parameter: plainTextPassword - the password the user entered during login
// Returns: true if passwords match, false otherwise
User.prototype.comparePassword = async function (plainTextPassword) {
  // bcrypt.compare(plainText, hash) returns true/false
  // It does the salt/hash comparison securely without revealing the hash
  return await bcrypt.compare(plainTextPassword, this.password);
};

module.exports = User;
