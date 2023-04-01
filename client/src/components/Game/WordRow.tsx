import WordCell from "./WordCell";
import { LetterState } from "../../../../shared/LetterState";

export default function WordRow({
  word,
  guess,
}: {
  word: string;
  guess: LetterState[];
}) {
  return (
    <div className="d-flex w-100 mb-2">
      <WordCell letter={word?.charAt(0) || ""} letterState={guess[0]} />
      <WordCell letter={word?.charAt(1) || ""} letterState={guess[1]} />
      <WordCell letter={word?.charAt(2) || ""} letterState={guess[2]} />
      <WordCell letter={word?.charAt(3) || ""} letterState={guess[3]} />
      <WordCell letter={word?.charAt(4) || ""} letterState={guess[4]} />
    </div>
  );
}
