import { Action, AnyAction, configureStore, Middleware, Store } from "@reduxjs/toolkit";
import { SocketEvent } from "../../shared/SocketEvent";
import gameReducer, { setState } from "./gameStore"
import { io } from "socket.io-client";

const ioMiddleware: Middleware = (store: any) => {
  const socket = io("ws://localhost:3000").connect();
  const username = localStorage.getItem('username');

  socket.on(SocketEvent.GAME_STATE, (gameState) => {
    const currentPlayer = gameState.players?.find((player: any) => player.username === username);
    const currentRound = gameState.rounds?.[gameState.rounds.length - 1];
    const currentPlayerGuesses = currentRound?.playerGuesses
      .find((playerGuess: any) => playerGuess.username === username);


    store.dispatch(setState({ ...gameState, currentPlayer, currentPlayerGuesses, currentRound }));
  });

  return (next: any) => (action: AnyAction) => {
    if (action.type === 'createRoom') {
      socket.emit(
        SocketEvent.CREATE_ROOM,
        action.payload, username,
        (res: { success: boolean, error: string, roomId: string }) => {
          console.log({ res })
          if (res.success) {
            socket.emit(SocketEvent.JOIN_ROOM, res.roomId, username)
          } else {
            console.error(res.error);
          }
        },
      );
    }

    if (action.type === 'joinRoom') {
      socket.emit(SocketEvent.JOIN_ROOM, action.payload, username);
    }

    if (action.type === 'markReady') {
      socket.emit(SocketEvent.MARK_READY);
    }

    if (action.type === 'startGame') {
      socket.emit(SocketEvent.GAME_START);
    }

    if (action.type === 'makeGuess') {
      socket.emit(SocketEvent.MAKE_GUESS, action.payload);
    }

    next(action);
  }
}

export default configureStore({
  reducer: {
    game: gameReducer
  },
  middleware: (currentMiddleware) => currentMiddleware().concat(ioMiddleware)
});