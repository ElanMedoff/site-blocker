import blockedSites from "./utils/blockedSites";

chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  console.log(tab.url);
  if (!tab.url) return;

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
