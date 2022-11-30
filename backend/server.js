const bcrypt = require("bcrypt");
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const { createServer } = require("http");
const { Server } = require("socket.io");

const USER_FILE_PATH = "backend/data/users.json";
const RANKING_PATH = "backend/data/ranking.json";

const chatSession = session({
  secret: "tetris",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 300000 },
});

const app = express();
app.use(express.static("frontend"));
app.use(express.json());
app.use(chatSession);
const httpServer = createServer(app);
const io = new Server(httpServer);
io.use((socket, next) => {
  chatSession(socket.request, {}, next);
});

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

app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync(USER_FILE_PATH));

  if (username in users === false) {
    res.json({ status: "error", error: "user does not exists" });
    return;
  }

  const hashedPassword = users[username]["password"];
  if (!bcrypt.compareSync(password, hashedPassword)) {
    res.json({ status: "error", error: "password is incorrect" });
    return;
  }

  const responseUser = { name: users[username]["name"], username: username };

  req.session.user = responseUser;
  res.json({
    status: "success",
    message: "successfully logged in",
    user: responseUser,
  });
});

app.get("/ranking", (req, res) => {
  const ranking = JSON.parse(fs.readFileSync(RANKING_PATH));

  res.json({
    status: "success",
    message: "successfully get ranking",
    data: ranking,
  });
});

app.post("/ranking", (req, res) => {
  const { username, score } = req.body;

  const ranking = JSON.parse(fs.readFileSync(RANKING_PATH));

  let minScore = ranking[0].score;
  let minScoreIdx = 0;
  for (let i = 0; i < ranking.length; i++) {
    if (ranking[i].score < minScore) {
      minScore = ranking[i].score;
      minScoreIdx = i;
    }
  }

  if (minScore < score) {
    ranking[minScoreIdx] = { username: username, score: score };
    fs.writeFileSync(RANKING_PATH, JSON.stringify(ranking, null, " "));
    res.json({ status: "success", message: "ranking is updated" });
    return;
  }
  res.json({ status: "success", message: "ranking remain unchanged" });
});

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("join", () => {
    if (socket.request.session.user) {
      const user = socket.request.session.user;
      onlineUsers.push(user);

      if (onlineUsers.length === 1) {
        socket.emit("waiting");
      } else if (onlineUsers.length === 2) {
        io.emit("game start", JSON.stringify(onlineUsers));
      }
    }
  });

  socket.on("send board", (content) => {
    if (socket.request.session.user) {
      const { board, score, miniBoard } = JSON.parse(content);
      io.emit(
        "board",
        JSON.stringify({
          username: socket.request.session.user.username,
          board: board,
          score: score,
          miniBoard: miniBoard,
        })
      );
    }
  });

  socket.on("send game over", () => {
    if (socket.request.session.user) io.emit("game over");
  });
});

httpServer.listen(8000, () => {
  console.log("Server starting at port 8000");
});
