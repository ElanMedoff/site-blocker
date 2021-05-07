import React, { useEffect, useState } from "react";
import { Message } from "../../utils/types";
import Timer from "../Timer";
import styles from "./index.module.css";

export default function App() {
  const [isBlocking, setIsBlocking] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [isButtonReady, setIsButtonReady] = useState(false);
  console.log(isBlocking, isButtonDisabled, startCountdown);

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
    console.log({ isBlocking, isButtonDisabled, startCountdown });

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

  const onTimerComplete = () => {
    setIsButtonDisabled(false);
    setStartCountdown(false);
    setIsButtonReady(true);
  };

  return (
    <div className={styles.wrapper}>
      <div>Status: {isBlocking ? "blocking" : "not blocking"}</div>
      <Timer
        startCountdown={startCountdown}
        startSecond={30}
        startMinute={0}
        onComplete={onTimerComplete}
      />
      <button onClick={handleOnClick} disabled={isButtonDisabled}>
        toggle
      </button>
    </div>
  );
}
