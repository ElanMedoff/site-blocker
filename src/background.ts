import blockedSites from "./utils/blockedSites";
import { Message } from "./utils/types";

interface BackendState {
  isBlocking: boolean;
  blockingTimestamp: Date | null;
}

// set up proxy for better error messaging
const targetObj: BackendState = { isBlocking: true, blockingTimestamp: null };
const targetProxy: BackendState = new Proxy(targetObj, {
  set: (target, key: "isBlocking" | "blockingTimestamp", value) => {
    console.log(`BACKEND: ${String(key)} set to ${value}`);
    target[key] = value;
    return true;
  },
});
targetProxy.isBlocking = true;
targetProxy.blockingTimestamp = null;

chrome.storage.local.set({ isBlocking: targetProxy.isBlocking });
chrome.storage.local.set({ blockingTimestamp: targetProxy.blockingTimestamp });
// let blockingTimestamp: Date | null = null;

let blockingTimerId: NodeJS.Timeout | null;
// TODO make this into chrome state?

function getIsBlocking(callback: Function) {
  chrome.storage.local.get("isBlocking", (res) => {
    targetProxy.isBlocking = Boolean(res["isBlocking"]);
    callback(targetProxy.isBlocking);
  });
}

function getBlockingTimestamp(callback: Function) {
  chrome.storage.local.get("blockingTimestamp", (res) => {
    targetProxy.blockingTimestamp = res["blockingTimestamp"]
      ? res["blockingTimestamp"]
      : null;
    callback(targetProxy.blockingTimestamp);
  });
}

function sendBlockingTimestamp(blockingTimestamp: Date | null) {
  const message: Message = {
    type: "BLOCKING_TIMESTAMP",
    timestamp: blockingTimestamp,
  };
  chrome.runtime.sendMessage(message);
}

function sendIsBlockingStatus(isBlocking: boolean) {
  const message: Message = { type: "IS_BLOCKING_STATUS", isBlocking };
  chrome.runtime.sendMessage(message);
}

// TODO doesn't really seem to have helped the delay?
// chrome.tabs.onCreated.addListener((tab) => {
//   if (!tab.pendingUrl) return;
//   if (!tab.id) return;
//   if (!isBlocking) return;

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
      getIsBlocking(sendIsBlockingStatus);
      // sendIsBlockingStatus(isBlocking);
      console.log("BACKEND: received request for blocking status", {
        isBlocking: targetProxy.isBlocking,
      });
      break;
    case "TOGGLE_IS_BLOCKING":
      targetProxy.isBlocking = message.isBlocking;
      chrome.storage.local.set({ isBlocking: targetProxy.isBlocking });
      sendIsBlockingStatus(targetProxy.isBlocking);
      console.log("BACKEND: received request to toggle isBlocking status", {
        isBlocking: message.isBlocking,
      });
      break;
    case "REQ_BLOCKING_TIMESTAMP":
      console.log("BACKEND: received request for blocking timestamp", {
        blockingTimestamp: targetProxy.blockingTimestamp,
      });
      getBlockingTimestamp(sendBlockingTimestamp);
      // sendBlockingTimestamp(blockingTimestamp);
      break;
    case "SET_BLOCKING_TIMESTAMP":
      console.log("BACKEND: received request to set blocking timestamp", {
        timestamp: message.timestamp,
      });

      if (!message.timestamp) {
        // set all the variables like below
        targetProxy.blockingTimestamp = message.timestamp;
        chrome.storage.local.set({ blockingTimestamp: message.timestamp });
        sendBlockingTimestamp(targetProxy.blockingTimestamp);

        // cancel the timeout if it's ongoing
        if (blockingTimerId) {
          clearTimeout(blockingTimerId);
        }

        return;
      }

      targetProxy.blockingTimestamp = message.timestamp;
      chrome.storage.local.set({ blockingTimestamp: message.timestamp });
      sendBlockingTimestamp(targetProxy.blockingTimestamp);

      blockingTimerId = setTimeout(() => {
        targetProxy.blockingTimestamp = null;
        sendBlockingTimestamp(targetProxy.blockingTimestamp);
        chrome.storage.local.set({
          blockingTimestamp: targetProxy.blockingTimestamp,
        });

        targetProxy.isBlocking = true;
        sendIsBlockingStatus(targetProxy.isBlocking);
        chrome.storage.local.set({ isBlocking: targetProxy.isBlocking });

        console.log("BACKEND: in set timeout, setting to null");
      }, new Date(message.timestamp).getTime() - Date.now());
      break;
    default:
      break;
  }
});
