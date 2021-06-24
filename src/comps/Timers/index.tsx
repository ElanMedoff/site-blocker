import React, { Dispatch, SetStateAction } from "react";
import Timer from "../Timer";
import { formatTime } from "../../utils/formatters";
import styles from "./Timers.module.css";

interface TimersProps {
  setIsButtonDisabled: Dispatch<SetStateAction<boolean>>;
  setStartConfirmCountdown: Dispatch<SetStateAction<boolean>>;
  startConfirmCountdown: boolean;
  setIsButtonReady: Dispatch<SetStateAction<boolean>>;
  blockingTimestamp: string | null;
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

  console.log("CLIENT: in timer top level", { blockingTimestamp });

  const renderTimers = () => {
    if (blockingTimestamp) {
      const remainingSeconds =
        (new Date(blockingTimestamp).getTime() - Date.now()) / 1000;

      const startMinute = Math.floor(remainingSeconds / 60);
      const startSecond = Math.floor(remainingSeconds - startMinute * 60);

      return <Timer startMinute={startMinute} startSecond={startSecond} />;
    } else if (startConfirmCountdown) {
      return (
        <Timer
          onComplete={onConfirmTimerComplete}
          startMinute={0}
          startSecond={30}
          grey={true}
        />
      );
    } else {
      return <>{`${formatTime(0)}:${formatTime(0)}`}</>;
    }
  };

  return <div className={styles.timer}>{renderTimers()}</div>;
}
