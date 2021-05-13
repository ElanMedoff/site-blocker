import blockedSites from "./utils/blockedSites";
import { Message } from "./utils/types";

let isBlocking = true;
let startBlockingTimestamp: Date | null = null;

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

function getStartBlockingTimestamp(callback: Function) {
  chrome.storage.local.get("startBlockingTimestamp", (res) => {
    if (res["startBlockingTimestamp"]) {
      startBlockingTimestamp = res["startBlockingTimestamp"];
    } else {
      startBlockingTimestamp = null;
    }

    callback(startBlockingTimestamp);
  });
}

function sendStartBlockingTimestamp(startBlockingTimestamp: Date | null) {
  const message: Message = {
    type: "START_BLOCKING_TIMESTAMP",
    timestamp: startBlockingTimestamp,
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
    case "REQ_START_BLOCKING_TIMESTAMP":
      getStartBlockingTimestamp(sendStartBlockingTimestamp);
      // sendStartBlockingTimestamp(startBlockingTimestamp);
      break;
    case "SET_START_BLOCKING_TIMESTAMP":
      chrome.storage.local.set({ startBlockingTimestamp: message.timestamp });

      // does this make sense?
      setTimeout(() => {
        sendStartBlockingTimestamp(null);
        sendIsBlockingStatus(false);
        chrome.storage.local.set({ startBlockingTimestamp: null });
        chrome.storage.local.set({ isBlocking: false });
      }, Math.abs(message.timestamp.getTime() - Date.now()));
      break;
    default:
      break;
  }
});
