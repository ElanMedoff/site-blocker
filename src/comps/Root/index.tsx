import React, { useState, useEffect } from "react";
import { Message } from "../../utils/types";
import Status from "../Status";
import Timers from "../Timers";
import Toggle from "../Toggle";
import styles from "./index.module.css";

export default function Root() {
  // "global" state, lotta piping around, might want to actually make global later
  const [isBlocking, setIsBlocking] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [isButtonReady, setIsButtonReady] = useState(false);
  const [startBlockingTimestamp, setStartBlockingTimestamp] =
    useState<Date | null>(null);

  console.log(startBlockingTimestamp);

  // onload set "global" state
  useEffect(() => {
    const isBlockingRequest: Message = {
      type: "REQ_IS_BLOCKING_STATUS",
    };
    chrome.runtime.sendMessage(isBlockingRequest);

    const startBlockingTimestampRequest: Message = {
      type: "REQ_START_BLOCKING_TIMESTAMP",
    };
    chrome.runtime.sendMessage(startBlockingTimestampRequest);

    chrome.runtime.onMessage.addListener((message: Message) => {
      switch (message.type) {
        case "IS_BLOCKING_STATUS":
          setIsBlocking(message.isBlocking);
          break;
        case "START_BLOCKING_TIMESTAMP":
          setStartBlockingTimestamp(message.timestamp);
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <Status isBlocking={isBlocking} />
      <Timers
        startCountdown={startCountdown}
        setStartCountdown={setStartCountdown}
        setIsButtonDisabled={setIsButtonDisabled}
        setIsButtonReady={setIsButtonReady}
      />
      <Toggle
        isBlocking={isBlocking}
        setStartCountdown={setStartCountdown}
        isButtonReady={isButtonReady}
        setIsButtonReady={setIsButtonReady}
        isButtonDisabled={isButtonDisabled}
        setIsButtonDisabled={setIsButtonDisabled}
        startBlockingTimestamp={startBlockingTimestamp}
        setStartBlockingTimestamp={setStartBlockingTimestamp}
      />
    </div>
  );
}
