import { useEffect } from "react";
import { LetterState } from "../../../../shared/LetterState";
import WordRow from "./WordRow";

export default function WordsDisplay({
  guessedWords,
  state,
}: {
  guessedWords: string[];
  state: any;
}) {
  useEffect(() => {
    console.log({ guessedWords });
  }, [guessedWords]);
  return (
    <div className="w-100">
      {guessedWords.map((word: string, i: number) => (
        <WordRow
          key={i}
          word={word}
          guess={
            state.game.currentPlayerGuesses?.guesses[i] ||
            new Array(5).fill(LetterState.NOT_GUESSED)
          }
        />
      ))}
    </div>
  );
}
