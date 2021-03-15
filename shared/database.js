const Sequelize = require("sequelize");
const dotenv = require('dotenv');
dotenv.config();

// const sequelize = new Sequelize(process.env.DATABASE_URL);
const sequelize = new Sequelize("base_project_db", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
