import { Server } from "socket.io";
import { SocketEvent } from "shared/SocketEvent";
import { GamePool } from "./classes/GamePool";
import { Game } from "./classes/Game";
import { cloneDeep } from "lodash";

const io = new Server(3000, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  }
});

io.on(SocketEvent.CONNECTION, (socket) => {
  console.log(`${socket.id} connected`);

  socket.on(SocketEvent.CREATE_ROOM, (
    room: string,
    username: string,
    cb: Function,
  ) => {
    console.log(`Room ${room} created by ${username}`)

    const existingGame = GamePool.getGameByRoomId(room);
    if (!existingGame) {
      GamePool.add(new Game(room));

      cb({ success: true, roomId: room })
    } else {
      cb({ success: false, error: 'Game already exists' })
    }
  });

  socket.on(SocketEvent.JOIN_ROOM, (room: string, username: string) => {
    socket.data.username = username;
    socket.rooms.forEach((currentRoom) => socket.leave(currentRoom));
    socket.join(room);
    socket.data.room = room;
    console.log(`${username} joined room ${room}`);

    const game = GamePool.getGameByRoomId(room);

    game?.addPlayer(username, !game.playerCount);

    emitGameState(room);
  });

  socket.on(SocketEvent.MARK_READY, () => {
    const { room, username } = socket.data;

    if (!(room && username)) return;

    const game = GamePool.getGameByRoomId(room);

    game?.markPlayerAsReady(username);

    emitGameState(room);
  });

  socket.on(SocketEvent.GAME_START, () => {
    const { room, username } = socket.data;

    if (!(room && username)) return;

    const game = GamePool.getGameByRoomId(room);
    game?.startGame();

    emitGameState(room);
  });

  socket.on(SocketEvent.MAKE_GUESS, (word: string) => {
    const { room, username } = socket.data;

    if (!(room && username)) return;

    const game = GamePool.getGameByRoomId(room);
    game?.currentRound.makeGuess(word, username);

    emitGameState(room);
  });

});

function emitGameState(room: string) {
  const game: any | Game = cloneDeep(GamePool.getGameByRoomId(room));
  delete game['readySubject$'];

  io.to(room).emit(SocketEvent.GAME_STATE, game);
}
