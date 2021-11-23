const sendingPackets = require("../packets/sendingPackets");

const playerLoaded = (rooms, roomID) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      room.playersLoaded++;

      if (room.playersLoaded - 1 == room.players.length) {
        allCards = room.allCards.sort(() => Math.random() - 0.5);

        room.questionCards = room.questionCards.sort(() => Math.random() - 0.5);

        const packet = {
          response: sendingPackets.Response.All_PLAYERS_LOADED,

          allCardsSetup: room.allCards,
          questionCardsSetup: room.questionCards,
        };

        for (i = 0; i < room.players.length; i++) {
          room.sockets[i].send(JSON.stringify(packet));
        }
      }
    }
  });
};

const playerDoneWithActions = (rooms, roomID) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      room.playersDoneWithAction++;

      if (room.playersDoneWithAction - 1 == room.players.length) {
        const packet = {
          response: sendingPackets.Response.ALL_PLAYERS_DONE_WITH_ACTION,
        };

        for (i = 0; i < room.players.length; i++) {
          room.sockets[i].send(JSON.stringify(packet));
        }

        room.playersDoneWithAction = 1;
      }
    }
  });
};

const playerDrawsCard = (rooms, roomID, socket) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      const packet = {
        response: sendingPackets.Response.OTHER_PLAYER_DRAWS_CARD,
      };

      for (i = 0; i < room.players.length; i++) {
        if (room.sockets[i] != socket) {
          room.sockets[i].send(JSON.stringify(packet));
        }
      }
    }
  });
};

const playerReturnsCard = (rooms, roomID, socket) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      const packet = {
        response: sendingPackets.Response.OTHER_PLAYER_RETURNS_CARD,
      };

      for (i = 0; i < room.players.length; i++) {
        if (room.sockets[i] != socket) {
          room.sockets[i].send(JSON.stringify(packet));
        }
      }
    }
  });
};

const playerDrawAndExchangeCard = (rooms, roomID, socket, cardPos) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      const packet = {
        response: sendingPackets.Response.OTHER_PLAYER_DRAWS_AND_EXCHANGES,
        exchangedCardPos: cardPos,
      };

      for (i = 0; i < room.players.length; i++) {
        if (room.sockets[i] != socket) {
          room.sockets[i].send(JSON.stringify(packet));
        }
      }
    }
  });
};

module.exports = {
  playerLoaded,
  playerDoneWithActions,
  playerDrawsCard,
  playerDrawAndExchangeCard,
  playerReturnsCard,
};
