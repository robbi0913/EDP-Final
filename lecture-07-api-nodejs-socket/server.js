require("dotenv").config();
const express = require("express");
const http = require("node:http");
const path = require("node:path");
const setupChat = require("./socket");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

setupChat(server);


app.use(express.static(path.join(__dirname, "view")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "chat.html"));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});