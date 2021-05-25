import { BackendState } from "./types";

type Properties<T> = keyof T;
type Values<T> = T[Properties<T>];

/*
TODO

Two issues: 
first, is it alright to cast the type of the chrome returned object

second, am I doing the return type of the promise right? the return type of the promise looks different 
than the return type of each individual resolve in each case. 
*/

export function chromeStorageGet(
  key: Properties<BackendState>,
  targetProxy: BackendState
) {
  // return new Promise<Values<BackendState>>((resolve, reject) => {
  return new Promise<BackendState[typeof key]>((resolve, reject) => {
    chrome.storage.local.get(key, (uncast) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      // TODO I think this is wrong? Not sure this intersection is doing what I think
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
          const blockingTimerId = data as BackendState["blockingTimerId"];
          targetProxy.blockingTimerId = blockingTimerId;
          resolve(blockingTimerId);
          break;
        case "blockingTimestamp":
          const blockingTimestamp = data as BackendState["blockingTimestamp"];
          targetProxy.blockingTimestamp = blockingTimestamp;
          resolve(blockingTimestamp);
          break;
        default:
          break;
      }
    });
  });
}
