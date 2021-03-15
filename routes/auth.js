const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

function generateAccessToken(userData) {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
}

/**
 * Create account
 */
router.post("/register", (req, res) => {
  console.log("register called");
  console.log(req.body);
  User.findOne({
    where: { email: req.body.email },
  })
    .then((result) => {
      if (result == null) {
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            console.log(hash);
            User.create({
              username: req.body.username,
              email: req.body.email,
              password: hash,
            })
              .then((user) => {
                console.log("created user: " + user);
                res.status(201).json({
                  message: "User created!",
                  // user: user,
                });
              })
              .catch((err) => {
                console.log("error creating user");
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          })
          .catch((err) => {
            console.log("error hashing password");
            res.status(500).json({
              error: err,
            });
          });
      } else
        res.status(409).json({
          error: "A user with the given email address already exists!",
        });
    })
    .catch((err) => {
      console.log("error finding user: " + error);
      res.status(500).json({
        error: err,
      });
    });
});

/**
 * Login
 */
router.post("/login", (req, res) => {
  // console.log("login called");
  // console.log(req.body);
  User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => {
      if (user != null) {
        console.log(user.dataValues);
        bcrypt
          .compare(req.body.password, user.password)
          .then((matches) => {
            if (matches) {
              const payload = {
                email: user.dataValues.email,
                userId: user.dataValues.id,
              };
              const accessToken = generateAccessToken(payload);
              const refreshToken = jwt.sign(
                payload,
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1m" }
              );
              user.refresh_token = refreshToken;
              user
                .save({ fields: ["refresh_token"] })
                .then(() => {
                  res.status(200).json({
                    userId: user.dataValues.id,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                  });
                })
                .catch((err) => {
                  res.status(401).json({
                    error: "Invalid credentials!" + err,
                  });
                });
            } else
              res.status(401).json({
                error: "Invalid credentials!",
              });
          })
          .catch((err) => {
            console.log("error comparing passwords");
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      } else
        res.status(404).json({
          error: "User not found!",
        });
    })
    .catch((err) => {
      console.log("error finding user");
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

// TODO: Logout

router.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken)
    return res.status(403).json({
      error: "Forbidden!",
    });
  else {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, userData) => {
        if (err)
          return res.status(401).json({
            error: "Unauthorized!" + err,
          });
        const userId = userData.userId;
        console.log("userData from refresh: " + userData);
        User.findOne({ where: { id: userId } }).then((user) => {
          if (user != null) {
            if (user.refresh_token.trim() == refreshToken) {
              let newAccessToken = generateAccessToken({
                userId: userData.userId,
                email: userData.email,
              });
              res.status(200).json({
                accessToken: newAccessToken,
              });
            } else
              res.status(403).json({
                error: "Refresh token doesn't exist!",
              });
          } else
            res.status(404).json({
              error: "User not found!",
            });
        });
      }
    );
  }
});

module.exports = router;
