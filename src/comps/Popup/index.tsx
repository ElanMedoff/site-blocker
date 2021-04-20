import React, { useEffect, useState } from "react";
import { Message } from "../../utils/types";

export default function App() {
  const [isBlocking, setIsBlocking] = useState(true);

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

  return (
    <>
      <div>Status: {isBlocking ? "blocking" : "not blocking"}</div>
      {/* Timer */}
      <button onClick={toggleIsBlocking}>toggle</button>
    </>
  );
}
