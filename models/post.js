const Sequelize = require("sequelize");

const sequelize = require("../shared/database");

const Post = sequelize.define("post", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.CHAR,
    length: 50,
    allowNull: false,
  },
  content: {
    type: Sequelize.CHAR,
    length: 1000,
  }
});

module.exports = Post;
