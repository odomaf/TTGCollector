const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Game extends Model {}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    min_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
      thumbnail: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    published: {
      type: DataTypes.TEXT,
    },
    bgg_id: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    minplaytime: {
      type: DataTypes.INTEGER,
    },
    maxplaytime: {
      type: DataTypes.INTEGER,
    },
    minage: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: "game",
    tableName: "games", 
  },
);

// Associations are defined in index.js

module.exports = Game;
