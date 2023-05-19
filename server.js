const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const fs = require("fs");

const port = 3000;

const usersRoutes = require("./routes/users.routes");
const postsRoutes = require("./routes/posts.routes");

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use("/users", usersRoutes);
server.use("/posts", postsRoutes);

server.listen(port, () => {
  console.log("Server running on port http://localhost:3000");
});
