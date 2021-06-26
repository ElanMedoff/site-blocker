import React, { Dispatch, SetStateAction } from "react";
import { Message } from "@utils/types";
import styles from "./Toggle.module.css";

interface ToggleProps {
  isBlocking: boolean;
  isButtonReady: boolean;
  setIsButtonReady: Dispatch<SetStateAction<boolean>>;
  isButtonDisabled: boolean;
  setIsButtonDisabled: Dispatch<SetStateAction<boolean>>;
  setStartConfirmCountdown: Dispatch<SetStateAction<boolean>>;
  blockingTimestamp: string | null;
}

export default function Toggle({
  isBlocking,
  isButtonReady,
  setIsButtonReady,
  setIsButtonDisabled,
  isButtonDisabled,
  setStartConfirmCountdown,
}: ToggleProps) {
  const sendToggleIsBlocking = () => {
    const message: Message = {
      type: "TOGGLE_IS_BLOCKING",
      isBlocking: !isBlocking,
    };
    chrome.runtime.sendMessage(message);
  };

  const sendBlockingTimestamp = (timestamp: string | null) => {
    const message: Message = {
      type: "SET_BLOCKING_TIMESTAMP",
      timestamp,
    };
    chrome.runtime.sendMessage(message);
  };

  const handleOnClick = () => {
    // if it's not blocking, allow immediate blocking
    if (!isBlocking) {
      sendBlockingTimestamp(null);
      sendToggleIsBlocking();
      return;
    }

    // otherwise if it's blocking, and button is ready, toggle
    if (isButtonReady) {
      const timestamp = String(new Date(Date.now() + 30 * 60 * 1 * 1000));
      sendBlockingTimestamp(timestamp);
      sendToggleIsBlocking();
      setIsButtonReady(false);
      return;
    }

    // otherwise start timer sequence
    setIsButtonDisabled(true);
    setStartConfirmCountdown(true);
  };

  return (
    <div className={styles.buttonWrapper}>
      <button
        className={styles.button}
        onClick={handleOnClick}
        disabled={isButtonDisabled}
      >
        toggle
      </button>
    </div>
  );
}
