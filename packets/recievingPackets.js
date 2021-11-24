const Request = {
    NONE: 0,

    HOST_CREATE_GAME_ROOM: 1,
    HOST_KICK_PLAYER: 2,
    HOST_START_GAME: 3,

    CLIENT_JOIN_GAME_ROOM: 4,
    CLIENT_REQUEST_ALL_ROOMS: 5,
    CLIENT_LEAVE_GAME_ROOM: 6,

    PLAYER_LOADED_INTO_GAME: 7,

    PLAYER_DONE_SHOWING_ACTIONS: 8,

    PLAYER_DRAWS_CARD: 9,
    PLAYER_RETURNS_CARD: 10,
    PLAYER_EXCHANGES_CARD_WITH_DECK_AFTER_DRAWING: 11,

    PLAYER_IS_TRADING: 12, 
    PLAYER_REQUESTS_CARD: 13,
    PLAYER_REPLY_TO_TRADE: 14, 
    PLAYER_COULD_NOT_TRADE: 15,
    PLAYER_CHOSE_PLAYER_TO_TRADE_WITH: 16,
    PLAYER_ANSWERED_QUESTION: 17,
    PLAYER_CHOSE_CARD_TO_KEEP_BACK: 18,

    PLAYER_MAKING_WORD: 19,
    PLAYER_MADE_WORD: 20,
}

module.exports = {
    Request
}