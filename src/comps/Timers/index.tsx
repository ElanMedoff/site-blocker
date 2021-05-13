import React, { Dispatch, SetStateAction } from "react";
import Timer from "../Timer";
import { formatTime } from "../../utils/formatters";

interface TimersProps {
  setIsButtonDisabled: Dispatch<SetStateAction<boolean>>;
  setStartConfirmCountdown: Dispatch<SetStateAction<boolean>>;
  startConfirmCountdown: boolean;
  setIsButtonReady: Dispatch<SetStateAction<boolean>>;
  blockingTimestamp: Date | null;
}

export default function Timers({
  setIsButtonDisabled,
  setStartConfirmCountdown,
  startConfirmCountdown,
  setIsButtonReady,
  blockingTimestamp,
}: TimersProps) {
  const onConfirmTimerComplete = () => {
    setIsButtonDisabled(false);
    setStartConfirmCountdown(false);
    setIsButtonReady(true);
  };

  const renderTimers = () => {
    if (blockingTimestamp) {
      const remainingSeconds =
        (new Date(blockingTimestamp).getTime() - Date.now()) / 1000;

      // TODO what to do if negative!!!
      console.log((new Date(blockingTimestamp).getTime() - Date.now()) / 1000);

      const startMinute = Math.floor(remainingSeconds / 60);
      const startSecond = Math.floor(remainingSeconds - startMinute * 60);

      return <Timer startMinute={startMinute} startSecond={startSecond} />;
    } else if (startConfirmCountdown) {
      return (
        <Timer
          onComplete={onConfirmTimerComplete}
          startMinute={0}
          startSecond={4}
        />
      );
    } else {
      return <>{`${formatTime(0)}:${formatTime(0)}`}</>;
    }
  };

  return <div>{renderTimers()}</div>;
}
