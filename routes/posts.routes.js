const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//Get all posts:
router.get("/", (req, res) => {
  fs.readFile("./user-post-api/posts.json", (err, data) => {
    if (err) {
      res.status(500).send("Something went wrong");
    } else {
      res.send(JSON.parse(data));
    }
  });
});

//Get 1 post by id:
router.get("/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile("./user-post-api/posts.json", (err, data) => {
    if (err) {
      res.status(500).send("Something went wrong");
    } else {
      const posts = JSON.parse(data);
      const post = posts.find((post) => post.id === parseInt(id));
      res.send(post);
    }
  });
});

//Middleware to check if input is empty:
const checkInput = (req, res, next) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).send("Missing title or body");
  } else {
    next();
  }
};

//Create a new post (POST):
router.post("/", checkInput, (req, res) => {
  const { title, body } = req.body;
  fs.readFile("./user-post-api/posts.json", (err, data) => {
    if (err) {
      res.status(500).send("Something went wrong");
    } else {
      const posts = JSON.parse(data);
      const newPost = {
        id: Math.floor(new Date()) * 10000,
        userId: posts.length / 10 + 1,
        title,
        body,
      };
      posts.push(newPost);
      fs.writeFile(
        "./user-post-api/posts.json",
        JSON.stringify(posts),
        (err) => {
          if (err) {
            res.status(500).send("Something went wrong");
          } else {
            res.status(201).send({
              status: "success",
              message: "Post created successfully",
              data: newPost,
            });
          }
        }
      );
    }
  });
});

//Update a post (PUT):
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    let dataPosts = JSON.parse(fs.readFileSync("./user-post-api/posts.json"));
    const post = dataPosts.find((post) => post.id === parseInt(id));
    if (!post) {
      return res.status(404).send("Post not found");
    } else {
      post.title = title;
      post.body = body;
      fs.writeFileSync("./user-post-api/posts.json", JSON.stringify(dataPosts));
      res.status(200).send({
        status: "success",
        message: "Post updated successfully",
        data: post,
      });
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

//Delete a post (DELETE):
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    let dataPosts = JSON.parse(fs.readFileSync("./user-post-api/posts.json"));
    const post = dataPosts.find((post) => post.id === parseInt(id));
    if (!post) {
      return res.status(404).send("Post not found");
    } else {
      dataPosts = dataPosts.filter((post) => post.id !== parseInt(id));
      fs.writeFileSync("./user-post-api/posts.json", JSON.stringify(dataPosts));
      res.status(200).send({
        status: "success",
        message: "Post deleted successfully",
      });
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

//Render all posts by userId:
router.get("/users/:userId", (req, res) => {
  const { userId } = req.params;
  fs.readFile("./user-post-api/posts.json", (err, data) => {
    if (err) {
      res.status(500).send("Something went wrong");
    } else {
      const posts = JSON.parse(data);
      const userPosts = posts.filter(
        (post) => post.userId === parseInt(userId)
      );
      res.send(userPosts);
    }
  });
});

module.exports = router;
