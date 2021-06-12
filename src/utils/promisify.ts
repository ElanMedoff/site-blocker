import {
  BackendState,
  // isBlockingTimerId,
  // isBlockingTimestamp,
  // isIsBlocking,
} from "./types";

type Properties<T> = keyof T;

export function chromeStorageGet(key: Properties<BackendState>) {
  return new Promise<BackendState[typeof key]>((resolve, reject) => {
    chrome.storage.local.get(key, (uncast) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);

      // have to cast somewhere?
      const cast = uncast as BackendState;
      const data = cast[key];
      resolve(data);

      // TODO ts isn't smart enough to figure this out, make helpers instead?

      // switch (key) {
      //   case "blockingTimerId":
      //     if (!isBlockingTimerId(data)) {
      //       throw new Error(`expected blockingTimerId, got ${typeof data}`);
      //     }
      //     resolve(data);
      //     break;

      //   case "blockingTimestamp":
      //     if (!isBlockingTimestamp(data)) {
      //       throw new Error(`expected blockingTimestamp, got ${typeof data}`);
      //     }
      //     resolve(data);
      //     break;

      //   case "isBlocking":
      //     const isBlocking = !!data;
      //     if (!isIsBlocking(isBlocking)) {
      //       throw new Error(`expected isBlocking, got ${typeof data}`);
      //     }
      //     break;

      //   default:
      //     throw new Error("unrecognized key!");
      // }
    });
  });
}
