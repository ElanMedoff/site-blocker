/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/blockedSites.ts":
/*!***********************************!*\
  !*** ./src/utils/blockedSites.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var blockedSites = [
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{0,256}imgur.[-a-zA-Z0-9@:%._\+~#=]{1,256}(\/)?/,
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{0,256}youtube.[-a-zA-Z0-9@:%._\+~#=]{1,256}(\/)?/,
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{0,256}reddit.[-a-zA-Z0-9@:%._\+~#=]{1,256}(\/)?/,
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{0,256}messenger.[-a-zA-Z0-9@:%._\+~#=]{1,256}(\/)?/,
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{0,256}linkedin.[-a-zA-Z0-9@:%._\+~#=]{1,256}(\/)?/,
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{0,256}news.google.[-a-zA-Z0-9@:%._\+~#=]{1,256}(\/)?/,
];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (blockedSites);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_blockedSites__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/blockedSites */ "./src/utils/blockedSites.ts");

var isBlocking = true;
chrome.storage.local.set({ isBlocking: true });
var blockingTimestamp = null;
chrome.storage.local.set({ blockingTimestamp: null });
var blockingTimerId;
function getIsBlocking(callback) {
    chrome.storage.local.get("isBlocking", function (res) {
        if (res["isBlocking"]) {
            isBlocking = true;
        }
        else {
            isBlocking = false;
        }
        callback(isBlocking);
    });
}
function getBlockingTimestamp(callback) {
    chrome.storage.local.get("blockingTimestamp", function (res) {
        if (res["blockingTimestamp"]) {
            blockingTimestamp = res["blockingTimestamp"];
        }
        else {
            blockingTimestamp = null;
        }
        callback(blockingTimestamp);
    });
}
function sendBlockingTimestamp(blockingTimestamp) {
    var message = {
        type: "BLOCKING_TIMESTAMP",
        timestamp: blockingTimestamp,
    };
    chrome.runtime.sendMessage(message);
}
function sendIsBlockingStatus(isBlocking) {
    var message = { type: "IS_BLOCKING_STATUS", isBlocking: isBlocking };
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
chrome.tabs.onUpdated.addListener(function (tabId, _, tab) {
    if (!tab.url)
        return;
    if (!isBlocking)
        return;
    // want to run sync, don't want to bother with forEach
    for (var _i = 0, blockedSites_1 = _utils_blockedSites__WEBPACK_IMPORTED_MODULE_0__.default; _i < blockedSites_1.length; _i++) {
        var regex = blockedSites_1[_i];
        if (regex.test(tab.url)) {
            chrome.tabs.remove(tabId, function () {
                console.log("removed", tabId, tab.url);
            });
            break;
        }
    }
});
chrome.runtime.onMessage.addListener(function (message) {
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
        case "REQ_BLOCKING_TIMESTAMP":
            console.log("BACKEND: received request for blocking timestamp", {
                blockingTimestamp: blockingTimestamp,
            });
            getBlockingTimestamp(sendBlockingTimestamp);
            // sendBlockingTimestamp(blockingTimestamp);
            break;
        case "SET_BLOCKING_TIMESTAMP":
            console.log("BACKEND: received request to set blocking timestamp", message.timestamp);
            if (!message.timestamp) {
                // set all the variables like below
                blockingTimestamp = message.timestamp;
                chrome.storage.local.set({ blockingTimestamp: message.timestamp });
                sendBlockingTimestamp(blockingTimestamp);
                // cancel the timeout if it's ongoing
                if (blockingTimerId) {
                    clearTimeout(blockingTimerId);
                }
                return;
            }
            blockingTimestamp = message.timestamp;
            chrome.storage.local.set({ blockingTimestamp: message.timestamp });
            sendBlockingTimestamp(blockingTimestamp);
            blockingTimerId = setTimeout(function () {
                blockingTimestamp = null;
                sendBlockingTimestamp(blockingTimestamp);
                chrome.storage.local.set({ blockingTimestamp: blockingTimestamp });
                isBlocking = true;
                sendIsBlockingStatus(isBlocking);
                chrome.storage.local.set({ isBlocking: isBlocking });
                console.log("BACKEND: in set timeout, setting to null");
            }, new Date(message.timestamp).getTime() - Date.now());
            break;
        default:
            break;
    }
});

})();

/******/ })()
;
//# sourceMappingURL=background.js.map