import React, { useState } from "react";
import useInterval from "../../hooks/useInterval";

const formatTime = (number: number): string => {
  return number.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
};

interface TimerProps {
  startSecond: number;
  startMinute: number;
  onComplete: () => void;
}

function Timer({ onComplete, startSecond, startMinute }: TimerProps) {
  const [minute, setMinute] = useState(startMinute ? startMinute : 0);
  const [second, setSecond] = useState(startSecond ? startSecond : 0);

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

  return (
    <div>
      {formatTime(minute)}:{formatTime(second)}
    </div>
  );
}

interface TimerWrapperProps {
  onComplete: () => void;
  startSecond: number;
  startMinute: number;
  startCountdown: boolean;
}

export default function TimerWrapper({
  onComplete,
  startSecond,
  startMinute,
  startCountdown,
}: TimerWrapperProps) {
  return (
    <div>
      {startCountdown ? (
        <Timer
          onComplete={onComplete}
          startMinute={startMinute}
          startSecond={startSecond}
        />
      ) : (
        `${formatTime(0)}:${formatTime(0)}`
      )}
    </div>
  );
}
