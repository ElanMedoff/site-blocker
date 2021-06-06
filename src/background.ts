import blockedSites from "./utils/blockedSites";
import {
  Message,
  isIsBlocking,
  isBlockingTimerId,
  isBlockingTimestamp,
} from "./utils/types";
import { chromeStorageGet } from "./utils/promisify";

chrome.storage.local.set({ isBlocking: true });
chrome.storage.local.set({ blockingTimestamp: null });
chrome.storage.local.set({ blockingTimerId: null });

// isBlocking timers
function sendIsBlockingStatus(isBlocking: boolean) {
  const message: Message = { type: "IS_BLOCKING_STATUS", isBlocking };
  chrome.runtime.sendMessage(message);
}

function setIsBlocking(isBlocking: boolean): void {
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

function setBlockingTimestamp(blockingTimestamp: Date | null): void {
  chrome.storage.local.set({ blockingTimestamp });
  sendBlockingTimestamp(blockingTimestamp);
}

function setBlockingTimerId(blockingTimerId: number | null): void {
  chrome.storage.local.set({ blockingTimerId });
}

// TODO doesn't really seem to have helped the delay?
// chrome.tabs.onCreated.addListener(async (tab) => {
//   if (!tab.pendingUrl) return;
//   if (!tab.id) return;
//   const isBlocking = Boolean(await chromeStorageGet("isBlocking"));
//   if (!isIsBlocking(isBlocking)) return;

//   for (const regex of blockedSites) {
//     if (regex.test(tab.pendingUrl)) {
//       chrome.tabs.remove(tab.id);
//       break;
//     }
//   }
// });

chrome.tabs.onUpdated.addListener(async (tabId, _, tab) => {
  if (!tab.url) return;
  const isBlocking = Boolean(await chromeStorageGet("isBlocking"));
  if (!isIsBlocking(isBlocking)) return;

  if (!isBlocking) return;

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

chrome.runtime.onMessage.addListener(async (message: Message) => {
  switch (message.type) {
    case "REQ_IS_BLOCKING_STATUS":
      const isBlocking = Boolean(await chromeStorageGet("isBlocking"));
      console.log("BACKEND: received request for blocking status", {
        isBlocking,
      });

      if (!isIsBlocking(isBlocking)) return;
      sendIsBlockingStatus(isBlocking);

      break;

    case "TOGGLE_IS_BLOCKING":
      setIsBlocking(message.isBlocking);
      console.log("BACKEND: received request to toggle isBlocking status", {
        isBlocking: message.isBlocking,
      });
      break;

    case "REQ_BLOCKING_TIMESTAMP":
      const blockingTimestamp = await chromeStorageGet("blockingTimestamp");
      console.log("BACKEND: received request for blocking timestamp", {
        blockingTimestamp,
      });

      if (!isBlockingTimestamp(blockingTimestamp)) return;
      sendBlockingTimestamp(blockingTimestamp);
      break;

    case "SET_BLOCKING_TIMESTAMP":
      console.log("BACKEND: received request to set blocking timestamp", {
        timestamp: message.timestamp,
      });

      // if the message sent has a null timestamp, i.e. cancel the current timer
      if (!message.timestamp) {
        console.log("INSIDE if statement for null timestamp");
        setBlockingTimestamp(message.timestamp);

        const blockingTimerId = await chromeStorageGet("blockingTimerId");
        if (!isBlockingTimerId(blockingTimerId)) return;

        // if there's a current timer, cancel it
        if (blockingTimerId) {
          clearTimeout(blockingTimerId);
        }
        setBlockingTimerId(null);

        return;
      }
      console.log("INSIDE: after if statement for null timestamp");

      // if the message sent a real timestamp
      setBlockingTimestamp(message.timestamp);

      const blockingTimerId = setTimeout(() => {
        // once timer finishes
        console.log("BACKEND: in set timeout, setting to null");
        setBlockingTimestamp(null);
        setIsBlocking(true);
        setBlockingTimerId(null);
      }, new Date(message.timestamp as Date).getTime() - Date.now()) as unknown as number;

      setBlockingTimerId(blockingTimerId);

      break;

    default:
      break;
  }
});
