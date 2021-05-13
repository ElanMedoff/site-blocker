import React, { useState } from "react";
import useInterval from "../../hooks/useInterval";
import { formatTime } from "../../utils/formatters";

interface TimerProps {
  startSecond: number;
  startMinute: number;
  onComplete?: () => void;
}

export default function Timer({
  onComplete,
  startSecond,
  startMinute,
}: TimerProps) {
  const [minute, setMinute] = useState(startMinute ? startMinute : 0);
  const [second, setSecond] = useState(startSecond ? startSecond : 0);

  useInterval((clear: () => void) => {
    if (second === 0 && minute === 0) {
      if (onComplete) onComplete();
      clear();
    } else if (second === 0) {
      setSecond(59);
      setMinute((prev) => prev - 1);
    } else {
      setSecond((prev) => prev - 1);
    }
  }, 1000);

  return (
    <div>
      {formatTime(minute)}:{formatTime(second)}
    </div>
  );
}
