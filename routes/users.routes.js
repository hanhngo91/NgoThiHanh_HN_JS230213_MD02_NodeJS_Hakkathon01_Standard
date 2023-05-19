const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//Get all users:
router.get("/", (req, res) => {
  fs.readFile("./user-post-api/users.json", (err, data) => {
    if (err) {
      res.status(500).send("Something went wrong");
    } else {
      res.send(JSON.parse(data));
    }
  });
});

//Get 1 user by id:
router.get("/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile("./user-post-api/users.json", (err, data) => {
    if (err) {
      res.status(500).send("Something went wrong");
    } else {
      const users = JSON.parse(data);
      const user = users.find((user) => user.id === parseInt(id));
      res.send(user);
    }
  });
});

//Middleware to check if user exists:
const checkUser = (req, res, next) => {
  const { username } = req.body;
  fs.readFile("./user-post-api/users.json", (err, data) => {
    if (err) {
      res.status(500).send("Something went wrong");
    } else {
      const users = JSON.parse(data);
      const user = users.find((user) => user.username === username);
      if (user) {
        return res.status(400).send("User already exists");
      } else {
        next();
      }
    }
  });
};

//Create a new user (POST):
router.post("/", checkUser, (req, res) => {
  const { username, email } = req.body;
  fs.readFile("./user-post-api/users.json", (err, data) => {
    if (err) {
      res.status(500).send("Something went wrong");
    } else {
      const users = JSON.parse(data);
      const newUser = {
        id: Math.floor(new Date()) * 10000,
        name: "",
        username,
        email,
        address: {
          street: "",
          suite: "",
          city: "",
          zipcode: "",
          geo: { lat: "", lng: "" },
        },
        phone: "",
        website: "",
        company: {
          name: "",
          catchPhrase: "",
          bs: "",
        },
      };
      users.push(newUser);
      fs.writeFile(
        "./user-post-api/users.json",
        JSON.stringify(users),
        (err) => {
          if (err) {
            return res.status(500).send("Something went wrong");
          } else {
            return res.status(201).send(newUser);
          }
        }
      );
    }
  });
});

//Update a user (PUT):
router.put("/:id", checkUser, (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    let dataUsers = JSON.parse(fs.readFileSync("./user-post-api/users.json"));
    let user = dataUsers.find((user) => user.id === parseInt(id));
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      user.username = username;
      user.email = email;
      fs.writeFileSync("./user-post-api/users.json", JSON.stringify(dataUsers));
      return res.status(200).send({
        status: "success",
        message: "User updated successfully",
        data: user,
      });
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

//Delete a user (DELETE):
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  try {
    let dataUsers = JSON.parse(fs.readFileSync("./user-post-api/users.json"));
    let user = dataUsers.find((user) => user.id === parseInt(id));
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      dataUsers = dataUsers.filter((user) => user.id !== parseInt(id));
      fs.writeFileSync("./user-post-api/users.json", JSON.stringify(dataUsers));
      return res.status(200).send({
        status: "success",
        message: "User deleted successfully",
        data: user,
      });
    }
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});
module.exports = router;
