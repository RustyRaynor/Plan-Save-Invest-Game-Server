const sendingPackets = require("../packets/sendingPackets");

const playerLoaded = (rooms, roomID) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      room.playersLoaded++;

      if (room.playersLoaded - 1 == room.players.length) {
        room.totalCards -= 6 * room.players.length;

        console.log(room.totalCards + " total cards left after distributing");

        let allCards = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
          37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
        ];

        allCards = allCards.sort(() => Math.random() - 0.5);

        let questionCards = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
          37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
          54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
        ];

        questionCards = questionCards.sort(() => Math.random() - 0.5);

        const packet = {
          response: sendingPackets.Response.All_PLAYERS_LOADED,

          allCardsSetup: allCards,
          questionCardsSetup: questionCards,
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
        if (room.totalCards != 0) {
          const packet = {
            response: sendingPackets.Response.ALL_PLAYERS_DONE_WITH_ACTION,
          };

          for (i = 0; i < room.players.length; i++) {
            room.sockets[i].send(JSON.stringify(packet));
          }
        } else {
          console.log("Game end due to no more cards in deck");
          const endGamePacket = {
            response: sendingPackets.Response.GAME_END,
            players: room.players,
            delay: 2,
          };

          for (i = 0; i < room.players.length; i++) {
            room.sockets[i].send(JSON.stringify(endGamePacket));
          }
          room.totalCards = 69;
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

const playerStartsTrade = (rooms, roomID, socket) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      const packet = {
        response: sendingPackets.Response.OTHER_PLAYER_IS_TRADING,
      };

      for (i = 0; i < room.players.length; i++) {
        if (room.sockets[i] != socket) {
          room.sockets[i].send(JSON.stringify(packet));
        }
      }
    }
  });
};

const playerRequestsCard = (
  rooms,
  roomID,
  socket,
  givenCardType,
  givenCardLetter
) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      const packet = {
        response: sendingPackets.Response.OTHER_PLAYER_REQUESTED_CARD,
        cardType: givenCardType,
        cardLetter: givenCardLetter,
      };

      for (i = 0; i < room.players.length; i++) {
        if (room.sockets[i] != socket) {
          room.sockets[i].send(JSON.stringify(packet));
        }
      }
    }
  });
};

const playerRepliedToTrade = (
  rooms,
  roomID,
  isTrading,
  cardPos,
  playerIndex,
  currentTradingPlayerIndex
) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      room.playersDoneWithAction++;

      console.log(room.playersDoneWithAction);

      if (isTrading) {
        room.tradingPlayers.push(playerIndex);
        room.tradingPlayersCardPos.push(cardPos);
      }

      if (room.playersDoneWithAction - 1 == room.players.length - 1) {
        const packet = {
          response: sendingPackets.Response.ALL_TRADING_PLAYERS_RECIEVED,
          tradingPlayers: room.tradingPlayers,
          tradingPlayersCardPos: room.tradingPlayersCardPos,
        };

        for (i = 0; i < room.players.length; i++) {
          if (i == currentTradingPlayerIndex) {
            room.sockets[i].send(JSON.stringify(packet));
          }

          room.playersDoneWithAction = 1;
          room.tradingPlayers = [];
          room.tradingPlayersCardPos = [];
        }
      }
    }
  });
};

const playerCouldNotTrade = (rooms, roomID, socket) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      const packet = {
        response: sendingPackets.Response.OTHER_PLAYER_COULD_NOT_TRADE,
      };

      for (i = 0; i < room.players.length; i++) {
        if (room.sockets[i] != socket) {
          room.sockets[i].send(JSON.stringify(packet));
        }
      }
    }
  });
};

const playerChosenToTradeWith = (rooms, roomID, socket, chosenPlayer) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      const packet = {
        response: sendingPackets.Response.OTHER_PLAYER_CHOSE_PLAYER_TO_TRADE,
        playerChosenToTrade: chosenPlayer,
      };

      for (i = 0; i < room.players.length; i++) {
        if (room.sockets[i] != socket) {
          room.sockets[i].send(JSON.stringify(packet));
        }
      }
    }
  });
};

const playerAnsweredQuestion = (
  rooms,
  roomID,
  socket,
  answerGiven,
  tradingPlayer,
  pointsGiven
) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      const packet = {
        response: sendingPackets.Response.OTHER_PLAYER_ANSWERED_QUESTION,
        answer: answerGiven,
        points: pointsGiven,
      };

      for (i = 0; i < room.players.length; i++) {
        if (room.sockets[i] != socket) {
          room.sockets[i].send(JSON.stringify(packet));
        }
        if (i == tradingPlayer) {
          room.players[i].score += pointsGiven;
        }
      }
    }
  });
};

const playerChoseCardToKeepBack = (rooms, roomID, socket, recPos, givePos) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      const packet = {
        response: sendingPackets.Response.OTHER_PLAYER_CHOSE_CARD_TO_KEEP_BACK,
        recievingPlayerPos: recPos,
        givingPlayerPos: givePos,
      };

      for (i = 0; i < room.players.length; i++) {
        if (room.sockets[i] != socket) {
          room.sockets[i].send(JSON.stringify(packet));
        }
      }
    }
  });
};

const playerMakingWord = (rooms, roomID, socket) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      const packet = {
        response: sendingPackets.Response.OTHER_PLAYER_MAKING_WORD,
      };

      for (i = 0; i < room.players.length; i++) {
        if (room.sockets[i] != socket) {
          room.sockets[i].send(JSON.stringify(packet));
        }
      }
    }
  });
};

const playerMadeWord = (rooms, roomID, socket, cardPos, pointsGiven) => {
  rooms.map((room) => {
    if (room.id == roomID) {
      for (x = 0; x < cardPos.length; x++) {
        room.totalCards -= 1;
      }

      console.log(room.totalCards + " total cards");

      const packet = {
        response: sendingPackets.Response.OTHER_PLAYER_MAKING_WORD,
        wordCardPos: cardPos,
        points: pointsGiven,
      };

      for (i = 0; i < room.players.length; i++) {
        if (room.sockets[i] != socket) {
          room.sockets[i].send(JSON.stringify(packet));
        } else {
          room.players[i].score += points;
        }
      }

      if (room.totalCards < cardPos.length) {
        console.log("Game end due to no cards left to give");
        const endGamePacket = {
          response: sendingPackets.Response.GAME_END,
          players: room.players,
          delay: 6,
        };

        for (i = 0; i < room.players.length; i++) {
          room.sockets[i].send(JSON.stringify(endGamePacket));
        }
        room.totalCards = 69;
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
  playerStartsTrade,
  playerRequestsCard,
  playerRepliedToTrade,
  playerCouldNotTrade,
  playerChosenToTradeWith,
  playerAnsweredQuestion,
  playerChoseCardToKeepBack,
  playerMakingWord,
  playerMadeWord,
};
