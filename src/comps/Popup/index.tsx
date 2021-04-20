import React, { useEffect, useState } from "react";
import { Message } from "../../utils/types";

export default function App() {
  // TODO probably move into a custom hook?
  const [isBlocking, setIsBlocking] = useState(true);

  // on mount, set isBlocking and set up even listener for changes
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
    // isn't really necessary, since they'll send a message back which I accept
    // setIsBlocking((prev) => !prev);
  };

  return (
    <>
      <div>{isBlocking ? "ON" : "OFF"}</div>
      <button onClick={toggleIsBlocking}>toggle</button>
    </>
  );
}
