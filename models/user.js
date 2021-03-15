const { DataTypes } = require("sequelize");
const sequelize = require("../shared/database");

const User = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    email: {
      type: DataTypes.CHAR(254),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.CHAR(60),
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.CHAR(300),
      unique: false,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "users",
  }
);

module.exports = User;
