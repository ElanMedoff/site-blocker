import blockedSites from "./utils/blockedSites";
import { Message } from "./utils/types";

let isBlocking = true;
chrome.storage.local.set({ isBlocking: true });

let blockingTimestamp: Date | null = null;
chrome.storage.local.set({ blockingTimestamp: null });

let blockingTimerId: NodeJS.Timeout | null;

function getIsBlocking(callback: Function) {
  chrome.storage.local.get("isBlocking", (res) => {
    if (res["isBlocking"]) {
      isBlocking = true;
    } else {
      isBlocking = false;
    }

    callback(isBlocking);
  });
}

function getBlockingTimestamp(callback: Function) {
  chrome.storage.local.get("blockingTimestamp", (res) => {
    if (res["blockingTimestamp"]) {
      blockingTimestamp = res["blockingTimestamp"];
    } else {
      blockingTimestamp = null;
    }

    callback(blockingTimestamp);
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
  if (!isBlocking) return;

  // want to run sync, don't want to bother with forEach
  for (const regex of blockedSites) {
    if (regex.test(tab.url)) {
      chrome.tabs.remove(tabId, () => {
        console.log("removed", tabId, tab.url);
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
      break;
    case "TOGGLE_IS_BLOCKING":
      isBlocking = message.isBlocking;
      chrome.storage.local.set({ isBlocking: isBlocking });
      sendIsBlockingStatus(isBlocking);
      break;
    case "REQ_BLOCKING_TIMESTAMP":
      console.log("BACKEND: received request for blocking timestamp", {
        blockingTimestamp,
      });
      getBlockingTimestamp(sendBlockingTimestamp);
      // sendBlockingTimestamp(blockingTimestamp);
      break;
    case "SET_BLOCKING_TIMESTAMP":
      console.log(
        "BACKEND: received request to set blocking timestamp",
        message.timestamp
      );

      if (!message.timestamp) {
        // set all the variables like below
        blockingTimestamp = message.timestamp;
        chrome.storage.local.set({ blockingTimestamp: message.timestamp });
        sendBlockingTimestamp(blockingTimestamp);

        // cancel the timeout if it's ongoing
        if (blockingTimerId) {
          clearTimeout(blockingTimerId);
        }

        return;
      }

      blockingTimestamp = message.timestamp;
      chrome.storage.local.set({ blockingTimestamp: message.timestamp });
      sendBlockingTimestamp(blockingTimestamp);

      blockingTimerId = setTimeout(() => {
        blockingTimestamp = null;
        sendBlockingTimestamp(blockingTimestamp);
        chrome.storage.local.set({ blockingTimestamp });

        isBlocking = true;
        sendIsBlockingStatus(isBlocking);
        chrome.storage.local.set({ isBlocking });

        console.log("BACKEND: in set timeout, setting to null");
      }, new Date(message.timestamp).getTime() - Date.now());
      break;
    default:
      break;
  }
});
