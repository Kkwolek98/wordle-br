import { Action, AnyAction, configureStore, Middleware, Store } from "@reduxjs/toolkit";
import { SocketEvent } from "../../shared/SocketEvent";
import gameReducer, { setState } from "./gameStore"
import { io } from "socket.io-client";

const ioMiddleware: Middleware = (store: any) => {
  const socket = io("ws://localhost:3000").connect();

  return (next: any) => (action: AnyAction) => {
    const username = localStorage.getItem('username');

    socket.on(SocketEvent.CONNECTION, () => {
      console.log('SOCKET.IO connected')
    });

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

    socket.on(SocketEvent.GAME_STATE, (gameState) => {
      store.dispatch(setState(gameState))
    });

    next(action);
  }
}

export default configureStore({
  reducer: {
    game: gameReducer
  },
  middleware: (currentMiddleware) => currentMiddleware().concat(ioMiddleware)
});