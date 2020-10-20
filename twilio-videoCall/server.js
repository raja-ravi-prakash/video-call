const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const controller = require("./controllers/twilio.controller");

var connectedUsers = new Set();

io.on("connection", (socket) => {
  connectedUsers.add(socket);

  socket.on("disconnect", () => {
    connectedUsers.delete(socket);
  });
});

app.use(express.static("public"));

http.listen(5000, (req, res) => console.log("App Running at localhost:5000"));
