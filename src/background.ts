import blockedSites from "./utils/blockedSites";
import { Message, BackendState } from "./utils/types";
import { chromeStorageGet } from "utils/promisify";

// set up proxy for better error messaging
const targetObj: BackendState = {
  isBlocking: true,
  blockingTimestamp: null,
  blockingTimerId: null,
};
const targetProxy: BackendState = new Proxy(targetObj, {
  set: (target, key: "isBlocking" | "blockingTimestamp", value) => {
    console.log(`BACKEND: ${String(key)} set to ${value}`);
    target[key] = value;
    return true;
  },
});
targetProxy.isBlocking = true;
targetProxy.blockingTimestamp = null;
targetProxy.blockingTimerId = null;

chrome.storage.local.set({ isBlocking: targetProxy.isBlocking });
chrome.storage.local.set({ blockingTimestamp: targetProxy.blockingTimestamp });
chrome.storage.local.set({ blockingTimerId: targetProxy.blockingTimerId });

// isBlocking timers
function sendIsBlockingStatus(isBlocking: boolean) {
  const message: Message = { type: "IS_BLOCKING_STATUS", isBlocking };
  chrome.runtime.sendMessage(message);
}

// function getIsBlocking(callback: Function) {
//   chrome.storage.local.get("isBlocking", (res) => {
//     targetProxy.isBlocking = Boolean(res["isBlocking"]);
//     callback(targetProxy.isBlocking);
//   });
// }

function setIsBlocking(isBlocking: boolean): void {
  targetProxy.isBlocking = isBlocking;
  chrome.storage.local.set({ isBlocking });
  sendIsBlockingStatus(isBlocking);
}

// blockingTimestamp helpers
function sendBlockingTimestamp(blockingTimestamp: Date | null) {
  const message: Message = {
    type: "BLOCKING_TIMESTAMP",
    timestamp: blockingTimestamp,
  };
  chrome.runtime.sendMessage(message);
}

// function getBlockingTimestamp(callback: Function) {
//   chrome.storage.local.get("blockingTimestamp", (res) => {
//     targetProxy.blockingTimestamp = res["blockingTimestamp"]
//       ? res["blockingTimestamp"]
//       : null;
//     callback(targetProxy.blockingTimestamp);
//   });
// }

function setBlockingTimestamp(blockingTimestamp: Date | null): void {
  targetProxy.blockingTimestamp = blockingTimestamp;
  chrome.storage.local.set({ blockingTimestamp });
  sendBlockingTimestamp(blockingTimestamp);
}

// blockingTimerId helpers
// function getBlockingTimerId(callback: Function) {
//   chrome.storage.local.get("blockingTimerId", (res) => {
//     targetProxy.blockingTimerId = res["blockingTimerId"]
//       ? res["blockingTimerId"]
//       : null;
//     callback(targetProxy.blockingTimerId);
//   });
// }

function setBlockingTimerId(blockingTimerId: number | null): void {
  targetProxy.blockingTimerId = blockingTimerId;
  chrome.storage.local.set({ blockingTimerId });
}

// TODO doesn't really seem to have helped the delay?
// chrome.tabs.onCreated.addListener((tab) => {
//   if (!tab.pendingUrl) return;
//   if (!tab.id) return;
//   if (!targetProxy.isBlocking) return;

//   for (const regex of blockedSites) {
//     if (regex.test(tab.pendingUrl)) {
//       chrome.tabs.remove(tab.id);
//       break;
//     }
//   }
// });

chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  if (!tab.url) return;
  if (!targetProxy.isBlocking) return;

  // want to run sync, don't want to bother with forEach
  for (const regex of blockedSites) {
    if (regex.test(tab.url)) {
      chrome.tabs.remove(tabId, () => {
        console.log("BACKEND: removed tab", { tabId, url: tab.url });
      });
      break;
    }
  }
});

chrome.runtime.onMessage.addListener((message: Message) => {
  switch (message.type) {
    case "REQ_IS_BLOCKING_STATUS":
      // getIsBlocking(sendIsBlockingStatus);
      chromeStorageGet("isBlocking", targetProxy).then((isBlocking) => {
        if (typeof isBlocking !== "boolean") return;
        sendIsBlockingStatus(isBlocking);
      });
      console.log("BACKEND: received request for blocking status", {
        isBlocking: targetProxy.isBlocking,
      });
      break;

    case "TOGGLE_IS_BLOCKING":
      setIsBlocking(message.isBlocking);
      console.log("BACKEND: received request to toggle isBlocking status", {
        isBlocking: message.isBlocking,
      });
      break;

    case "REQ_BLOCKING_TIMESTAMP":
      console.log("BACKEND: received request for blocking timestamp", {
        blockingTimestamp: targetProxy.blockingTimestamp,
      });

      // getBlockingTimestamp(sendBlockingTimestamp);
      chromeStorageGet("blockingTimestamp", targetProxy).then(
        (blockingTimestamp) => {
          if (
            !(blockingTimestamp === null || blockingTimestamp instanceof Date)
          )
            return;
          sendBlockingTimestamp(blockingTimestamp);
        }
      );
      break;

    case "SET_BLOCKING_TIMESTAMP":
      console.log("BACKEND: received request to set blocking timestamp", {
        timestamp: message.timestamp,
      });

      // if the message sent has a null timestamp, i.e. cancel the current timer
      if (!message.timestamp) {
        console.log("INSIDE if statement for null timestamp");
        setBlockingTimestamp(message.timestamp);

        chromeStorageGet("blockingTimerId", targetProxy).then(
          (blockingTimerId) => {
            if (
              !(typeof blockingTimerId === "number" || blockingTimerId === null)
            )
              return;
            if (blockingTimerId) {
              clearTimeout(blockingTimerId);
            }
            setBlockingTimerId(null);
          }
        );

        return;
      }
      console.log("INSIDE: after if statement for null timestamp");

      // if the message sent a real timestamp
      setBlockingTimestamp(message.timestamp);

      const blockingTimerId = window.setTimeout(() => {
        // once timer finishes
        console.log("BACKEND: in set timeout, setting to null");
        setBlockingTimestamp(null);
        setIsBlocking(true);
        setBlockingTimerId(null);
      }, new Date(message.timestamp as Date).getTime() - Date.now());

      setBlockingTimerId(blockingTimerId);
      // });

      break;

    default:
      break;
  }
});
