const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { ExpressPeerServer } = require("peer");
const port = process.env.PORT || 9001;

const peerServer = ExpressPeerServer(server, {
  path: "/",
});
app.use("/peer-endpoint", peerServer);

app.get("/", (req, res) => res.send("IT Valleys Peer server"));

server.listen(port, () => {
  console.log("Running...");
});
