const Request = {
    NONE: 0,

    HOST_CREATE_GAME_ROOM: 1,
    HOST_KICK_PLAYER: 2,
    HOST_START_GAME: 3,
    HOST_SYNC_GAME_TIMER: 4,
    HOST_END_GAME: 5,

    CLIENT_JOIN_GAME_ROOM: 6,
    CLIENT_REQUEST_ALL_ROOMS: 7,
    CLIENT_LEAVE_GAME_ROOM: 8,

    UPDATE_PLAYER_SCORE_AND_WORDS: 9,
}

module.exports = {
    Request
}