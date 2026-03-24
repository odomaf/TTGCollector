const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Mechanic extends Model {}

Mechanic.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    mechanic: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: "mechanic",
  }
);

// Associations are defined in index.js

module.exports = Mechanic;
