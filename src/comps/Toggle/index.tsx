import React, { Dispatch, SetStateAction } from "react";
import { Message } from "../../utils/types";
// import styles from "./Toggle.module.css";

interface ToggleProps {
  isBlocking: boolean;
  isButtonReady: boolean;
  setIsButtonReady: Dispatch<SetStateAction<boolean>>;
  isButtonDisabled: boolean;
  setIsButtonDisabled: Dispatch<SetStateAction<boolean>>;
  setStartConfirmCountdown: Dispatch<SetStateAction<boolean>>;
  blockingTimestamp: Date | null;
}

export default function Toggle({
  isBlocking,
  isButtonReady,
  setIsButtonReady,
  setIsButtonDisabled,
  isButtonDisabled,
  setStartConfirmCountdown,
  blockingTimestamp,
}: ToggleProps) {
  const sendToggleIsBlocking = () => {
    const message: Message = {
      type: "TOGGLE_IS_BLOCKING",
      isBlocking: !isBlocking,
    };
    chrome.runtime.sendMessage(message);
  };

  const sendBlockingTimestamp = (timestamp: Date | null) => {
    const message: Message = {
      type: "SET_BLOCKING_TIMESTAMP",
      timestamp,
    };
    chrome.runtime.sendMessage(message);
  };

  console.log(blockingTimestamp);

  const handleOnClick = () => {
    // if it's not blocking, allow immediate blocking
    if (!isBlocking) {
      // TODO mess with this
      sendBlockingTimestamp(null);
      sendToggleIsBlocking();
      return;
    }

    // otherwise if it's blocking, and button is ready, toggle
    if (isButtonReady) {
      // TODO set this number
      const timestamp = new Date(Date.now() + 30000);
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
    <>
      <button onClick={handleOnClick} disabled={isButtonDisabled}>
        toggle
      </button>
    </>
  );
}
