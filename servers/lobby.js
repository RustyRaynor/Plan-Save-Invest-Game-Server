const short = require("short-uuid");
const sendingPackets = require("../packets/sendingPackets");

const hostGame = (rooms, playerName, playerAvatarData, hostSocket) => {
  let uuid = short.generate();

  rooms.push({
    id: uuid,

    isInGame: false,

    playersLoaded: 1,
    playersDoneWithAction: 1,
    totalCards: 69,

    players: [
      {
        name: playerName,
        playerAvatar: playerAvatarData,
        score: 0,
      },
    ],

    sockets: [hostSocket],

    tradingPlayers : [],
    tradingPlayersCardPos : []
  });

  hostSocket.roomId = uuid;

  const packet = {
    response: sendingPackets.Response.HOST_GAME_ROOM_CREATED_SUCCESSFULLY,

    roomId: uuid,
    placeInOrder: 0,
    players: rooms[rooms.length - 1].players,
  };

  hostSocket.on("close", function () {
    console.log("Connection Lost");
    leaveRoom(rooms, hostSocket, uuid);
    hostSocket.terminate();
  });

  hostSocket.send(JSON.stringify(packet));
};

const getAllRooms = (rooms, socket) => {
  const listOfRooms = [];

  rooms.map((room) => {
    if (room.isInGame == false && room.players.length < 6) {
      listOfRooms.push({
        hostName: room.players[0].name,
        players: room.players.length,
        roomID: room.id,
      });
    }
  });

  const packet = {
    response: sendingPackets.Response.RECIEVE_ALL_ROOM_DATA,
    listOfRooms,
  };

  socket.send(JSON.stringify(packet));
};

const joinRoom = (rooms, playerName, playerAvatarData, socket, roomID) => {
  let joiningRoom;

  rooms.map((room) => {
    if (room.id == roomID) {
      joiningRoom = room;
    }
  });

  if (joiningRoom.players.length >= 6) {
    const packet = {
      response: sendingPackets.Response.CLIENT_FAILED_TO_JOIN_GAME_ROOM,

      reason: "Room Full",
    };
    socket.send(JSON.stringify(packet));
    return;
  } else if (joiningRoom.isInGame == true) {
    const packet = {
      response: sendingPackets.Response.CLIENT_FAILED_TO_JOIN_GAME_ROOM,

      reason: "Room In Game",
    };
    socket.send(JSON.stringify(packet));
    return;
  }

  joiningRoom.players.push({
    name: playerName,
    playerAvatar: playerAvatarData,
    score: 0,
  });
  joiningRoom.sockets.push(socket);

  socket.roomId = roomID;

  socket.on("close", function () {
    console.log("Connection Lost");
    leaveRoom(rooms, socket, roomID);
    socket.terminate();
  });

  const packet = {
    response: sendingPackets.Response.CLIENT_JOINED_GAME_ROOM_SUCCESSFULLY,

    roomId: joiningRoom.id,
    placeInOrder: joiningRoom.players.length - 1,
    players: joiningRoom.players,
  };

  socket.send(JSON.stringify(packet));

  const packetToOtherPlayers = {
    response: sendingPackets.Response.OTHER_PLAYER_JOINED_GAME_ROOM,

    newPlayer: joiningRoom.players[joiningRoom.players.length - 1],
  };

  for (i = 0; i < joiningRoom.players.length; i++) {
    if (joiningRoom.sockets[i] != socket) {
      joiningRoom.sockets[i].send(JSON.stringify(packetToOtherPlayers));
    }
  }
};

const leaveRoom = (rooms, socket, roomID) => {
  let leavingRoom;
  let leavingRoomPlace;

  rooms.map((room, index) => {
    if (room.id == roomID) {
      leavingRoom = room;
      leavingRoomPlace = index;

      leavingRoom.sockets.map((containedSocket, index) => {
        if (containedSocket === socket) {
          leavingRoom.players.splice(index, 1);
          leavingRoom.sockets.splice(index, 1);
        }
      });

      const packet = {
        response: sendingPackets.Response.CLIENT_LEFT_GAME_ROOM_SUCCCESSFULLY,
      };

      socket.send(JSON.stringify(packet));

      if (leavingRoom.players.length > 0) {
        for (i = 0; i < leavingRoom.players.length; i++) {
          const packetToOtherPlayers = {
            response: sendingPackets.Response.OTHER_PLAYER_LEFT_GAME_ROOM,

            players: leavingRoom.players,
            placeInOrder: i,
          };

          leavingRoom.sockets[i].send(JSON.stringify(packetToOtherPlayers));
        }
      } else {
        rooms.splice(leavingRoomPlace);
      }
    }
  });
};

const startGame = (rooms, roomID) => {
  rooms.map((room) => {
    if (room.id == roomID) {

      console.log("Host Started Game");
      
      room.isInGame = true;

      const packet = {
        response: sendingPackets.Response.HOST_STARTED_GAME_SUCCCESSFULLY,
      };

      room.sockets.map((playerSocket) => {
        playerSocket.send(JSON.stringify(packet));
      });
    }
  });
};

module.exports = {
  hostGame,
  getAllRooms,
  joinRoom,
  leaveRoom,
  startGame,
};
