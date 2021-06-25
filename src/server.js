const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (_, res) => res.sendFile(`${__dirname}/app/views/index.html`));

let users = [];

io.on("connection", (socket) => {
  io.emit("connection");
  users.push({ id: socket.id, nickname: "someone" });
  console.log(users);

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", { msg, nickname: socket.nickname });
  });

  socket.on("set nickname", (nickname) => {
    io.emit("set nickname", {
      previousNickname: socket.nickname || "someone",
      nickname,
    });

    users.forEach((user, i) => {
      if (user.id === socket.id) {
        return users.splice(i, 1, { id: user.id, nickname });
      }
    });
    console.log(users);
    socket.nickname = nickname;
  });

  socket.on("typing", () => socket.broadcast.emit("typing"));

  socket.on("disconnect", () => {
    io.emit("desconectou", socket.nickname || "someone");

    users = users.filter((user) => user.id !== socket.id);
  });
});

server.listen(3333, () => console.log("listening on 3333"));
