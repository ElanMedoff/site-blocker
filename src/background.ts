import {
  blockedSites,
  videoExceptions,
  playlistExceptions,
} from "@utils/blockedSites";
import {
  Message,
  isIsBlocking,
  isBlockingTimerId,
  isBlockingTimestamp,
} from "@utils/types";
import {
  chromeStorageGet,
  chromeTabsGet,
  chromeTabsRemove,
} from "@utils/promisify";

(async function init() {
  // should always be null, since on unmount it's set to null anyway
  chrome.storage.local.set({ blockingTimerId: null });

  const isBlocking = await chromeStorageGet("isBlocking");
  if (isBlocking === undefined) {
    chrome.storage.local.set({ isBlocking: true });
  }

  // first check if there's a timer ongoing
  const blockingTimestamp = await chromeStorageGet("blockingTimestamp");
  if (!isBlockingTimestamp(blockingTimestamp)) {
    throw new TypeError(
      `expected blockingTimestamp, got ${typeof blockingTimestamp}`
    );
  }

  if (!blockingTimestamp) {
    setBlockingTimestamp(null);
    return;
  }

  // negative timestamp, reset
  if (new Date(blockingTimestamp).getTime() - Date.now() < 0) {
    setBlockingTimestamp(null);
    return;
  }

  // ongoing timer
  if (new Date(blockingTimestamp).getTime() - Date.now() >= 0) {
    const blockingTimerId = setTimeout(() => {
      console.log("BACKEND: in set timeout, setting to null");
      setBlockingTimestamp(null);
      setIsBlocking(true);
      setBlockingTimerId(null);
    }, new Date(blockingTimestamp).getTime() - Date.now()) as unknown as number;

    setBlockingTimerId(blockingTimerId);
  }
})();

chrome.tabs.onUpdated.addListener(async (tabId, _, tab) => {
  // because this runs async and is fired many times one after the other, we don't know for sure
  // that the tab will still be around by the time this cb runs, it could have been removed by an
  // earlier cb ... I think
  const maybeTabExists = await chromeTabsGet(tabId).catch((err) =>
    console.log(err.message, "get")
  );
  if (!maybeTabExists) return;

  if (!tab.url) return;
  const isBlocking = !!(await chromeStorageGet("isBlocking"));
  if (!isIsBlocking(isBlocking)) {
    throw new TypeError(`expected isBlocking, got ${typeof isBlocking}`);
  }

  // todo refactor?
  if (!isBlocking) return;

  // exclude exceptions
  for (const exception of videoExceptions) {
    if (tab.url === exception) return;
  }

  for (const exception of playlistExceptions) {
    console.log(tab.url, tab.url.includes(exception));
    if (tab.url.includes(exception)) return;
  }

  // want to run sync, don't want to bother with forEach
  for (const regex of blockedSites) {
    if (regex.test(tab.url)) {
      // TODO
      // still not completely sure why this catch would trigger with the check above ...
      await chromeTabsRemove(tabId, tab.url).catch((err) =>
        console.log(err.message, "remove")
      );
      return;
    }
  }
});

// on unmount
chrome.runtime.onSuspend.addListener(async () => {
  const blockingTimerId = await chromeStorageGet("blockingTimerId");
  if (!isBlockingTimerId(blockingTimerId)) {
    throw new TypeError(
      `expected blockingTimerId, got ${typeof blockingTimerId}`
    );
  }

  // if there's a current timer, cancel it, but keep the timestamp
  if (blockingTimerId) {
    clearTimeout(blockingTimerId);
  }
  setBlockingTimerId(null);
});

chrome.runtime.onMessage.addListener(async (message: Message) => {
  switch (message.type) {
    case "REQ_IS_BLOCKING_STATUS":
      const isBlocking = await chromeStorageGet("isBlocking");
      console.log("BACKEND: received request for blocking status", {
        isBlocking,
      });

      if (!isIsBlocking(isBlocking)) {
        throw new TypeError(`expected isBlocking, got ${typeof isBlocking}`);
      }
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

      if (!isBlockingTimestamp(blockingTimestamp)) {
        throw new TypeError(
          `expected isBlockingTimestamp, got ${typeof blockingTimestamp}`
        );
      }
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
        if (!isBlockingTimerId(blockingTimerId)) {
          throw new TypeError(
            `expected blockingTimerId, got ${typeof blockingTimerId}`
          );
        }

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
      }, new Date(message.timestamp).getTime() - Date.now()) as unknown as number;

      setBlockingTimerId(blockingTimerId);
      break;

    default:
      break;
  }
});

// isBlocking helpers
function sendIsBlockingStatus(isBlocking: boolean) {
  const message: Message = { type: "IS_BLOCKING_STATUS", isBlocking };
  chrome.runtime.sendMessage(message);
}

function setIsBlocking(isBlocking: boolean): void {
  chrome.storage.local.set({ isBlocking });
  sendIsBlockingStatus(isBlocking);
}

// blockingTimestamp helpers
function sendBlockingTimestamp(blockingTimestamp: string | null) {
  const message: Message = {
    type: "BLOCKING_TIMESTAMP",
    timestamp: blockingTimestamp,
  };
  chrome.runtime.sendMessage(message);
}

function setBlockingTimestamp(blockingTimestamp: string | null): void {
  chrome.storage.local.set({ blockingTimestamp });
  sendBlockingTimestamp(blockingTimestamp);
}

// blockingTimerId helpers
function setBlockingTimerId(blockingTimerId: number | null): void {
  chrome.storage.local.set({ blockingTimerId });
}
