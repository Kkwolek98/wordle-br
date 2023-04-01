import { RefObject, useRef, useState } from "react";
import { GameState } from "../../../../shared/GameState";
import WordsDisplay from "./WordsDisplay";

export default function Game({
  state,
  dispatch,
}: {
  state: any;
  dispatch: Function;
}) {
  const [guessedWords, setGuessedWords] = useState(["", "", "", "", "", ""]);
  const inputRef: RefObject<HTMLInputElement> = useRef(null);

  function makeGuess() {
    const guess = inputRef.current?.value as string;
    dispatch({
      type: "makeGuess",
      payload: inputRef.current?.value,
    });
    const guessedWordsCopy = [...guessedWords];
    const currentGuessIndex = state.game?.currentPlayerGuesses?.guesses.length;
    guessedWordsCopy[currentGuessIndex] = guess;

    setGuessedWords(guessedWordsCopy);
  }

  return (
    <div>
      {state.game.state === GameState.ONGOING ? (
        <>
          <WordsDisplay guessedWords={guessedWords} state={state} />
          <input className="w-75" ref={inputRef} maxLength={5} />
          <button className="w-25" onClick={makeGuess}>
            Enter
          </button>
        </>
      ) : (
        <h1>Winner: {state.game.currentRound?.winner} </h1>
      )}
    </div>
  );
}
