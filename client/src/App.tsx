import { RefObject, useEffect, useRef, useState } from "react";
import "./App.css";
import { useDispatch, useSelector, useStore } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const gameState: any = useSelector((state: any) => state?.game);
  const [players, setPlayers] = useState([]);
  const [readyPlayers, setReadyPlayers] = useState([]);

  const roomNameRef: RefObject<HTMLInputElement> = useRef(null);

  useEffect(() => {
    dispatch({
      type: "connect",
    });
  });

  useEffect(() => {
    setPlayers(gameState.game?.players || []);
    const ready = gameState.game?.players?.filter(
      (player: any) => player.isReady
    );
    setReadyPlayers(ready || []);
  }, [gameState]);

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

  return (
    <div className="App">
      {gameState ? (
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
      <div>
        <input type="text" ref={roomNameRef} />
      </div>
      <button onClick={createRoom}>Create room</button>
      <button onClick={joinRoom}>Join room</button>
    </div>
  );
}

export default App;
