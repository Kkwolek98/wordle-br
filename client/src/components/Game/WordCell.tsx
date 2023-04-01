import { useEffect, useState } from "react";
import { LetterState } from "../../../../shared/LetterState";

export default function WordCell({
  letter,
  letterState,
}: {
  letter: string;
  letterState: LetterState;
}) {
  const [borderColor, setBorderColor] = useState("");
  useEffect(() => {
    let className = "";
    if (letterState === LetterState.DOESNT_OCCUR)
      className = "border-secondary";
    if (letterState === LetterState.WRONG_ORDER) className = "border-warning";
    if (letterState === LetterState.RIGHT_ORDER) className = "border-success";

    setBorderColor(className);
  }, [letterState]);
  return (
    <div
      className={
        "d-flex justify-content-center align-items-center border border-2 me-2 h1 " +
        borderColor
      }
      style={{ width: 64, height: 64 }}
    >
      {letter}
    </div>
  );
}
