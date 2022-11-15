const express = require("express");

const app = express();
app.use(express.static("frontend"));
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ status: "success", message: "Hello World!" });
});

app.listen(8000);
