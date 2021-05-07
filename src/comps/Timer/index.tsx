import React, { useState } from "react";
import useInterval from "../../hooks/useInterval";

interface TimerProps {
  onComplete: () => void;
  startSecond: number;
  startMinute: number;
  startCountdown: boolean;
}
export default function Timer({
  onComplete,
  startSecond,
  startMinute,
  startCountdown,
}: TimerProps) {
  const [minute, setMinute] = useState(startCountdown ? startMinute : 0);
  const [second, setSecond] = useState(startCountdown ? startSecond : 0);

  useInterval((clear: () => void) => {
    // TODO test if this works
    if (!startCountdown) return;

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
