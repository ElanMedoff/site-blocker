import React, { useState, useEffect } from "react";
import { Message } from "@utils/types";
import Status from "@comps/Status";
import Timers from "@comps/Timers";
import Toggle from "@comps/Toggle";
import styles from "./Root.module.css";

export default function Root() {
  // "global" state, lotta piping around, might want to actually make global later
  const [isBlocking, setIsBlocking] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [startConfirmCountdown, setStartConfirmCountdown] = useState(false);
  const [isButtonReady, setIsButtonReady] = useState(false);
  const [blockingTimestamp, setBlockingTimestamp] = useState<string | null>(
    null
  );

  // onload set "global" state
  useEffect(() => {
    const isBlockingRequest: Message = {
      type: "REQ_IS_BLOCKING_STATUS",
    };
    chrome.runtime.sendMessage(isBlockingRequest);
    console.log("CLIENT: sending for is blocking status request message", {
      isBlockingRequest,
    });

    const blockingTimestampRequest: Message = {
      type: "REQ_BLOCKING_TIMESTAMP",
    };
    chrome.runtime.sendMessage(blockingTimestampRequest);
    console.log("CLIENT: sending request for blocking timestamp message", {
      blockingTimestampRequest,
    });

    // Only set background variables in the listener to ensure that
    // when they're changed in the client, the changes are only reflected
    // if they make their way to the background, who then sends it back.
    // Is this a good pattern? not super sure
    chrome.runtime.onMessage.addListener((message: Message) => {
      switch (message.type) {
        case "IS_BLOCKING_STATUS":
          setIsBlocking(message.isBlocking);
          console.log("CLIENT: received messaged, setting blocking status", {
            isBlocking: message.isBlocking,
          });
          break;
        case "BLOCKING_TIMESTAMP":
          setBlockingTimestamp(message.timestamp);
          console.log("CLIENT: received messaged, setting blocking timestamp", {
            timestamp: message.timestamp,
          });

          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <Status
        isBlocking={isBlocking}
        startConfirmCountdown={startConfirmCountdown}
        isButtonReady={isButtonReady}
      />
      <Timers
        blockingTimestamp={blockingTimestamp}
        startConfirmCountdown={startConfirmCountdown}
        setStartConfirmCountdown={setStartConfirmCountdown}
        setIsButtonDisabled={setIsButtonDisabled}
        setIsButtonReady={setIsButtonReady}
      />
      <Toggle
        isBlocking={isBlocking}
        setStartConfirmCountdown={setStartConfirmCountdown}
        blockingTimestamp={blockingTimestamp}
        isButtonReady={isButtonReady}
        setIsButtonReady={setIsButtonReady}
        isButtonDisabled={isButtonDisabled}
        setIsButtonDisabled={setIsButtonDisabled}
      />
    </div>
  );
}

/* 
TODO:

use flexbox instead?
add ability to add sites
add ability to change times
*/
