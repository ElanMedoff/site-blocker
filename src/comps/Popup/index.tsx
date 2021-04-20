import React, { useEffect, useState } from "react";
import { Message } from "../../utils/types";
// import ConfirmTimer from "../ConfirmTimer";
// import CountdownTimer from "../CountdownTimer";
import Countdown from "react-countdown";

export default function App() {
  const [isBlocking, setIsBlocking] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showConfirmTimer, setShowConfirmTimer] = useState(false);
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
    if (!isBlocking) {
      toggleIsBlocking();
      return;
    }

    setIsButtonDisabled(true);
    setShowConfirmTimer(true);
  };

  const confirmTimerRenderer = ({ completed }: { completed: boolean }) => {
    if (completed) {
      setIsButtonDisabled(false);
      setShowConfirmTimer(false);
    }

    // expects a return value of a react node
    return <></>;
  };

  return (
    <>
      <div>Status: {isBlocking ? "blocking" : "not blocking"}</div>
      {/* <CountdownTimer isBlocking={isBlocking} /> */}
      <button
        onClick={() => {
          handleOnClick();
        }}
        disabled={isButtonDisabled}
      >
        toggle
      </button>
      {showConfirmTimer && (
        <Countdown date={Date.now() + 5000} renderer={confirmTimerRenderer} />
      )}
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
