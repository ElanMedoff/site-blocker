import React, { useEffect, useState } from "react";
import { Message } from "../../utils/types";
// import ConfirmTimer from "../ConfirmTimer";
// import CountdownTimer from "../CountdownTimer";
import Timer from "../Timer";

export default function App() {
  const [isBlocking, setIsBlocking] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showConfirmTimer, setShowConfirmTimer] = useState(false);
  const [isButtonReady, setIsButtonReady] = useState(false);
  console.log(isBlocking, isButtonDisabled, showConfirmTimer);

  useEffect(() => {
    const message: Message = {
      type: "REQ_IS_BLOCKING_STATUS",
    };
    chrome.runtime.sendMessage(message);

    chrome.runtime.onMessage.addListener((message: Message) => {
      switch (message.type) {
        case "IS_BLOCKING_STATUS":
          setIsBlocking(message.isBlocking);
          break;
        default:
          break;
      }
    });
  }, []);

  const toggleIsBlocking = () => {
    const message: Message = {
      type: "TOGGLE_IS_BLOCKING",
      isBlocking: !isBlocking,
    };
    chrome.runtime.sendMessage(message);
  };

  const handleOnClick = () => {
    console.log("clicked");
    console.log({ isBlocking, isButtonDisabled, showConfirmTimer });

    // TODO test this logic
    if (isButtonReady) {
      toggleIsBlocking();
      return;
    }

    // if (!isBlocking) {
    //   toggleIsBlocking();
    //   return;
    // }

    setIsButtonDisabled(true);
    setShowConfirmTimer(true);
  };

  const onTimerComplete = () => {
    setIsButtonDisabled(false);
    setShowConfirmTimer(false);
    setIsButtonReady(true);
  };

  return (
    <>
      <div>Status: {isBlocking ? "blocking" : "not blocking"}</div>
      <button
        onClick={() => {
          handleOnClick();
        }}
        disabled={isButtonDisabled}
      >
        toggle
      </button>
      {showConfirmTimer && <Timer onComplete={onTimerComplete} />}
      <button
        onClick={() => {
          console.log({ showConfirmTimer, isBlocking, isButtonDisabled });
        }}
      >
        Hello
      </button>
    </>
  );
}
