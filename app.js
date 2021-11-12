const Websocket = require("ws");
const recievedPackets = require("./packets/recievingPackets");
const lobby = require("./servers/lobby");

let rooms = [];

var wss = new Websocket.Server({ port: 8080 }, function () {
  console.log("Server Started");
});

wss.on("connection", function (socket) {
  console.log("Connected Client");

  socket.on("message", function (message) {
    var data = JSON.parse(message);

    switch (data.request) {
      case recievedPackets.Request.HOST_CREATE_GAME_ROOM:
        lobby.hostGame(rooms, data.playerName, data.playerAvatarData, socket);
        break;

      case recievedPackets.Request.CLIENT_REQUEST_ALL_ROOMS:
        lobby.getAllRooms(rooms, socket);
        break;

      case recievedPackets.Request.CLIENT_JOIN_GAME_ROOM:
        lobby.joinRoom(
          rooms,
          data.playerName,
          data.playerAvatarData,
          socket,
          data.roomID
        );
        break;

      case recievedPackets.Request.CLIENT_LEAVE_GAME_ROOM:
        lobby.leaveRoom(rooms, socket, data.roomID);
        break;
    }
  });
});
