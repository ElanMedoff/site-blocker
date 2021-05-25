import { BackendState, isBlockingTimerId, isBlockingTimestamp } from "./types";

type Properties<T> = keyof T;

export function chromeStorageGet(
  key: Properties<BackendState>,
  targetProxy: BackendState
) {
  return new Promise<BackendState[typeof key]>((resolve, reject) => {
    chrome.storage.local.get(key, (uncast) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      const cast = uncast as Omit<BackendState, "isBlocking"> & {
        isBlocking: boolean | undefined;
      };
      const data = cast[key];

      // set local state
      switch (key) {
        case "isBlocking":
          const isBlocking = Boolean(data);
          targetProxy.isBlocking = isBlocking;
          resolve(isBlocking);
          break;

        case "blockingTimerId":
          if (!isBlockingTimerId(data))
            throw new Error(
              `Expected blockingTimerId, got something else: ${data}, ${typeof data}`
            );
          targetProxy.blockingTimerId = data;
          resolve(data);
          break;

        case "blockingTimestamp":
          if (!isBlockingTimestamp(data))
            throw new Error(
              `Expected blockingTimestamp, got something else: ${data}, ${typeof data}`
            );
          targetProxy.blockingTimestamp = data;
          resolve(data);
          break;

        default:
          break;
      }
    });
  });
}
