const Sequelize = require("sequelize");

const sequelize = new Sequelize("base_project_db", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
}); // TODO: env, try out nidzo81 instead of postgres

module.exports = sequelize;
