import { RefObject, useEffect, useRef, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { GameState } from "../../shared/GameState";
import Game from "./components/Game/Game";

function App() {
  const dispatch = useDispatch();
  const state: any = useSelector((state: any) => state?.game);
  const [players, setPlayers] = useState([]);
  const [readyPlayers, setReadyPlayers] = useState([]);

  const roomNameRef: RefObject<HTMLInputElement> = useRef(null);

  useEffect(() => {
    dispatch({
      type: "connect",
    });
  });

  useEffect(() => {
    setPlayers(state.game?.players || []);
    const ready = state.game?.players?.filter((player: any) => player.isReady);
    setReadyPlayers(ready || []);
  }, [state]);

  function createRoom() {
    dispatch({
      type: "createRoom",
      payload: roomNameRef.current?.value,
    });
  }

  function joinRoom() {
    dispatch({
      type: "joinRoom",
      payload: roomNameRef.current?.value,
    });
  }

  function markReady() {
    dispatch({ type: "markReady" });
  }

  function startGame() {
    dispatch({ type: "startGame" });
  }

  return (
    <div className="App" data-bs-theme="dark">
      {state.game.state && state.game.state !== GameState.WAITING ? (
        <Game state={state} dispatch={dispatch} />
      ) : (
        <>
          {state ? (
            <div>
              Players ready: {readyPlayers.length}/{players.length}
              <ul>
                {players?.map((player: any) => (
                  <li key={player.username}>
                    {player.username} {player.isReady ? "Ready" : "Waiting"}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            "hehe"
          )}
          <div className="mb-2">
            <input type="text" ref={roomNameRef} />
          </div>
          {!state.game?.roomId ? (
            <>
              <button className="me-2" onClick={createRoom}>
                Create room
              </button>
              <button onClick={joinRoom}>Join room</button>
            </>
          ) : (
            <>
              {state.game.currentPlayer?.isHost && (
                <button className="me-2" onClick={startGame}>
                  Start
                </button>
              )}
              <button
                disabled={state.game.currentPlayer?.isReady}
                onClick={markReady}
              >
                Ready
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
