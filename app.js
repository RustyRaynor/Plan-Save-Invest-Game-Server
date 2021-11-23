const Websocket = require("ws");
const recievedPackets = require("./packets/recievingPackets");
const lobby = require("./servers/lobby");
const game = require("./servers/game");

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

      case recievedPackets.Request.HOST_START_GAME:
        lobby.startGame(rooms, data.roomID);
        break;

      case recievedPackets.Request.PLAYER_LOADED_INTO_GAME:
        game.playerLoaded(rooms, data.roomID);
        break;

      case recievedPackets.Request.PLAYER_DONE_SHOWING_ACTIONS:
        game.playerDoneWithActions(rooms, data.roomID);
        break;

      case recievedPackets.Request.PLAYER_DRAWS_CARD:
        game.playerDrawsCard(rooms, data.roomID, socket);
        break;

      case recievedPackets
        .Request.PLAYER_EXCHANGES_CARD_WITH_DECK_AFTER_DRAWING:
        game.playerDrawAndExchangeCard(
          rooms,
          data.roomID,
          socket,
          data.cardPos
        );
        break;

      case recievedPackets.Request.PLAYER_RETURNS_CARD:
        game.playerReturnsCard(rooms, data.roomID, socket);
        break;
    }
  });
});
