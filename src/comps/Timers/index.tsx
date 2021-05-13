import React, { Dispatch, SetStateAction } from "react";
import Timer from "../Timer";

interface TimersProps {
  setIsButtonDisabled: Dispatch<SetStateAction<boolean>>;
  setStartCountdown: Dispatch<SetStateAction<boolean>>;
  startCountdown: boolean;
  setIsButtonReady: Dispatch<SetStateAction<boolean>>;
}

export default function Timers({
  setIsButtonDisabled,
  setStartCountdown,
  startCountdown,
  setIsButtonReady,
}: TimersProps) {
  const onTimerComplete = () => {
    setIsButtonDisabled(false);
    setStartCountdown(false);
    setIsButtonReady(true);
  };

  return (
    <>
      <Timer
        startCountdown={startCountdown}
        // TODO change this back to 30 for production
        startSecond={2}
        startMinute={0}
        onComplete={onTimerComplete}
      />
    </>
  );
}
