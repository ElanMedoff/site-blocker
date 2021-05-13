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
  const [startConfirmCountdown, setStartConfirmCountdown] = useState(false);
  const [isButtonReady, setIsButtonReady] = useState(false);
  const [blockingTimestamp, setBlockingTimestamp] = useState<Date | null>(null);

  // onload set "global" state
  useEffect(() => {
    const isBlockingRequest: Message = {
      type: "REQ_IS_BLOCKING_STATUS",
    };
    chrome.runtime.sendMessage(isBlockingRequest);

    const blockingTimestampRequest: Message = {
      type: "REQ_BLOCKING_TIMESTAMP",
    };
    chrome.runtime.sendMessage(blockingTimestampRequest);

    chrome.runtime.onMessage.addListener((message: Message) => {
      switch (message.type) {
        case "IS_BLOCKING_STATUS":
          setIsBlocking(message.isBlocking);
          break;
        case "BLOCKING_TIMESTAMP":
          setBlockingTimestamp(message.timestamp);
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
        startConfirmCountdown={startConfirmCountdown}
        setStartConfirmCountdown={setStartConfirmCountdown}
        setIsButtonDisabled={setIsButtonDisabled}
        setIsButtonReady={setIsButtonReady}
        blockingTimestamp={blockingTimestamp}
      />
      <Toggle
        isBlocking={isBlocking}
        setStartConfirmCountdown={setStartConfirmCountdown}
        isButtonReady={isButtonReady}
        setIsButtonReady={setIsButtonReady}
        isButtonDisabled={isButtonDisabled}
        setIsButtonDisabled={setIsButtonDisabled}
        setBlockingTimestamp={setBlockingTimestamp}
      />
    </div>
  );
}

/* 
TODO:

Fix styling
see if I can fix the latency issues
Lotta piping props, maybe a global state would just be better
*/
