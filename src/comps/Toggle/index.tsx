import React, { Dispatch, SetStateAction } from "react";
import { Message } from "../../utils/types";

interface ToggleProps {
  isBlocking: boolean;
  isButtonReady: boolean;
  setIsButtonReady: Dispatch<SetStateAction<boolean>>;
  isButtonDisabled: boolean;
  setIsButtonDisabled: Dispatch<SetStateAction<boolean>>;
  setStartCountdown: Dispatch<SetStateAction<boolean>>;
  startBlockingTimestamp: Date | null;
  setStartBlockingTimestamp: Dispatch<SetStateAction<Date | null>>;
}

export default function Toggle({
  isBlocking,
  isButtonReady,
  setIsButtonReady,
  setIsButtonDisabled,
  isButtonDisabled,
  setStartCountdown,
  setStartBlockingTimestamp,
  startBlockingTimestamp,
}: ToggleProps) {
  const toggleIsBlocking = () => {
    const message: Message = {
      type: "TOGGLE_IS_BLOCKING",
      isBlocking: !isBlocking,
    };
    chrome.runtime.sendMessage(message);
  };

  console.log({ startBlockingTimestamp });

  const sendStartBlockingTimestamp = (timestamp: Date) => {
    const message: Message = {
      type: "SET_START_BLOCKING_TIMESTAMP",
      timestamp,
    };
    chrome.runtime.sendMessage(message);
  };

  const handleOnClick = () => {
    // if it's not blocking, allow immediate blocking
    if (!isBlocking) {
      toggleIsBlocking();
      return;
    }

    // otherwise if it's blocking, and button is ready, toggle
    if (isButtonReady) {
      // TODO in progress
      console.log("inside client if ready to toggle");
      const timestamp = new Date(Date.now() + 10000);
      console.log({ clientTimestamp: timestamp });
      sendStartBlockingTimestamp(timestamp);
      setStartBlockingTimestamp(timestamp);
      toggleIsBlocking();
      setIsButtonReady(false);
      return;
    }

    // otherwise start timer sequence
    setIsButtonDisabled(true);
    setStartCountdown(true);
  };

  return (
    <>
      <button onClick={handleOnClick} disabled={isButtonDisabled}>
        toggle
        {startBlockingTimestamp?.getTime()}
      </button>
    </>
  );
}
