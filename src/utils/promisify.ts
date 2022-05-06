import { BackendState } from "@utils/types";

type Properties<T> = keyof T;

export function chromeStorageGet(key: Properties<BackendState>) {
  return new Promise<BackendState[typeof key]>((resolve, reject) => {
    chrome.storage.local.get(key, (uncast) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);

      const cast = uncast as BackendState;
      const data = cast[key];
      resolve(data);
    });
  });
}

export function chromeTabsGet(tabId: number) {
  return new Promise<boolean>((resolve, reject) => {
    chrome.tabs.get(tabId, () => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      resolve(true);
    });
  });
}

export function chromeTabsRemove(tabId: number, tabUrl: string) {
  return new Promise<void>((resolve, reject) => {
    chrome.tabs.remove(tabId, () => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      console.log("BACKEND: removed tab", { tabId, tabUrl });
      resolve();
    });
  });
}
