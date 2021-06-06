import { BackendState } from "./types";

type Properties<T> = keyof T;

export function chromeStorageGet(key: Properties<BackendState>) {
  return new Promise<BackendState[typeof key]>((resolve, reject) => {
    chrome.storage.local.get(key, (uncast) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);

      // have to cast somewhere?
      const cast = uncast as BackendState;
      const data = cast[key];
      resolve(data);
    });
  });
}
