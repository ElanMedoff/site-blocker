import React, { useState } from "react";
import useInterval from "../../hooks/useInterval";

interface TimerProps {
  onComplete: () => void;
  startSecond: number;
  startMinute: number;
}
export default function Timer({
  onComplete,
  startSecond,
  startMinute,
}: TimerProps) {
  const [minute, setMinute] = useState(startMinute);
  const [second, setSecond] = useState(startSecond);

  useInterval((clear: () => void) => {
    if (second === 0 && minute === 0) {
      onComplete();
      clear();
    } else if (second === 0) {
      setSecond(59);
      setMinute((prev) => prev - 1);
    } else {
      setSecond((prev) => prev - 1);
    }
  }, 1000);

  const formattedSecond = second.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const formattedMinute = minute.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return (
    <div>
      {formattedMinute}:{formattedSecond}
    </div>
  );
}
