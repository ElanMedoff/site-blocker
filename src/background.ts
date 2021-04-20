import blockedSites from "./utils/blockedSites";
import { Message } from "./utils/types";

let isBlocking = true;

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
//       // TODO REGEX IS BROKEN!!!
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
      // TODO REGEX IS BROKEN!!!
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
      sendIsBlockingStatus(isBlocking);
      break;
    case "TOGGLE_IS_BLOCKING":
      isBlocking = message.isBlocking;
      console.log("message received", message);
      chrome.storage.local.set({ isBlocking: isBlocking });
      sendIsBlockingStatus(isBlocking);
      break;
    default:
      break;
  }
});
