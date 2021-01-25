const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const postRoutes = require("./routes/post");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/posts", postRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    sequelize.sync().then(() => {
      console.log("Models synced.");
      app.listen(process.env.PORT || 3000);
    });
  })
  .catch((err) => console.error("Unable to connect to the database:", err));
