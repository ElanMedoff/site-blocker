import React, { Dispatch, SetStateAction } from "react";
import { Message } from "../../utils/types";

interface ToggleProps {
  isBlocking: boolean;
  isButtonReady: boolean;
  setIsButtonReady: Dispatch<SetStateAction<boolean>>;
  isButtonDisabled: boolean;
  setIsButtonDisabled: Dispatch<SetStateAction<boolean>>;
  setStartCountdown: Dispatch<SetStateAction<boolean>>;
}

export default function Toggle({
  isBlocking,
  isButtonReady,
  setIsButtonReady,
  setIsButtonDisabled,
  isButtonDisabled,
  setStartCountdown,
}: ToggleProps) {
  const toggleIsBlocking = () => {
    const message: Message = {
      type: "TOGGLE_IS_BLOCKING",
      isBlocking: !isBlocking,
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
      </button>
    </>
  );
}
