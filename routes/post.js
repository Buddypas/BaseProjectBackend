const express = require("express");
const Post = require("../models/post");
const router = express.Router();
const checkAuth = require("../shared/check-auth");

/**
 * Get all posts
 */
router.get("", checkAuth, (req, res, next) => {
  const page = req.query.page;
  console.log("Page: " + page);

  Post.findAndCountAll({
    limit: 3,
    offset: page ? page * 3 : 0,
  })
    .then((result) => {
      const currentPage = page ? +page : 0;
      const totalPages = Math.ceil(+result.count / 3);
      const prevPage = page && page > 0 ? page - 1 : null;
      const nextPage = currentPage == totalPages - 1 ? null : currentPage + 1;
      res.status(200).json({
        data: result.rows,
        count: result.count,
        currentPage: currentPage,
        previousPage: prevPage,
        nextPage: nextPage,
        totalPages: totalPages,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: 500,
        error: "server-error",
        message: err,
      });
    });
});

/**
 * Add a new post
 */

router.post("/add", checkAuth, (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  if (title.length > 50 || content.length > 1000)
    return res.status(403).json({
      status: 403,
      error: "post-too-long",
      message: "Post title or content is too long.",
    });
  Post.create({
    title: title,
    content: content,
  })
    .then((result) => {
      console.log("Add result: " + result);
      res.status(200).json({
        message: "Post added!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: 500,
        error: "server-error",
        message: err,
      });
    });
});

module.exports = router;
