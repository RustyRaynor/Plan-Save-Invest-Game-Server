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

      case recievedPackets.Request.PLAYER_IS_TRADING:
        game.playerStartsTrade(rooms, data.roomID, socket);
        break;

      case recievedPackets.Request.PLAYER_REQUESTS_CARD:
        game.playerRequestsCard(
          rooms,
          data.roomID,
          socket,
          data.cardType,
          data.cardLetter
        );
        break;

      case recievedPackets.Request.PLAYER_REPLY_TO_TRADE:
        game.playerRepliedToTrade(
          rooms,
          data.roomID,
          data.isPlayerTrading,
          data.cardPos,
          data.playerIndex,
          data.currentTradingPlayerIndex
        );
        break;

      case recievedPackets.Request.PLAYER_COULD_NOT_TRADE:
        game.playerCouldNotTrade(rooms, data.roomID, socket);
        break;

      case recievedPackets.Request.PLAYER_CHOSE_PLAYER_TO_TRADE_WITH:
        game.playerChosenToTradeWith(
          rooms,
          data.roomID,
          socket,
          data.playerChosen
        );
        break;

      case recievedPackets.Request.PLAYER_ANSWERED_QUESTION:
        game.playerAnsweredQuestion(
          rooms,
          data.roomID,
          socket,
          data.answer,
          data.tradingPlayer,
          data.pointsGiven
        );
        break;

      case recievedPackets.Request.PLAYER_CHOSE_CARD_TO_KEEP_BACK:
        game.playerChoseCardToKeepBack(
          rooms,
          data.roomID,
          socket,
          data.recievingPlayerCardPos,
          data.tradingPlayerCardPos
        );
        break;

      case recievedPackets.Request.PLAYER_MAKING_WORD:
        game.playerMakingWord(rooms, data.roomID, socket);
        break;

      case recievedPackets.Request.PLAYER_MADE_WORD:
        game.playerMadeWord(
          rooms,
          data.roomID,
          socket,
          data.cardPositions,
          data.points
        );
        break;
    }
  });
});
