const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (_, res) => res.sendFile(`${__dirname}/app/views/index.html`));

io.on("connection", (socket) => {
  io.emit("connection");

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", { msg, nickname: socket.nickname });
  });

  socket.on("set nickname", (nickname) => {
    io.emit("set nickname", {
      previousNickname: socket.nickname || "someone",
      nickname,
    });

    socket.nickname = nickname;
  });

  socket.on("disconnect", () =>
    io.emit("desconectou", socket.nickname || "someone")
  );
});

server.listen(3333, () => console.log("listening on 3333"));
