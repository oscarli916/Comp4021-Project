const bcrypt = require("bcrypt");
const express = require("express");
const fs = require("fs");

const USER_FILE_PATH = "backend/data/users.json";

const app = express();
app.use(express.static("frontend"));
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ status: "success", message: "Hello World!" });
});

app.post("/register", (req, res) => {
  const { username, name, password } = req.body;

  const users = JSON.parse(fs.readFileSync(USER_FILE_PATH));

  if (username === "") {
    res.json({ status: "error", error: "username is empty" });
    return;
  }
  if (!/^\w+$/.test(username)) {
    res.json({
      status: "error",
      error: "username should contains only underscores, letters or numbers",
    });
    return;
  }
  if (username in users) {
    res.json({ status: "error", error: "username already exists" });
    return;
  }
  if (name === "") {
    res.json({ status: "error", error: "name is empty" });
    return;
  }
  if (password === "") {
    res.json({ status: "error", error: "password is empty" });
    return;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  users[username] = { name: name, password: hashedPassword };
  fs.writeFileSync(USER_FILE_PATH, JSON.stringify(users, null, " "));

  res.json({ status: "success", message: "users has been created" });
});

app.listen(8000, () => {
  console.log("Server starting at port 8000");
});
