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


/***/ }),

/***/ "./src/utils/promisify.ts":
/*!********************************!*\
  !*** ./src/utils/promisify.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "chromeStorageGet": () => (/* binding */ chromeStorageGet)
/* harmony export */ });
function chromeStorageGet(key) {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get(key, function (uncast) {
            if (chrome.runtime.lastError)
                return reject(chrome.runtime.lastError);
            // have to cast somewhere?
            var cast = uncast;
            var data = cast[key];
            resolve(data);
        });
    });
}


/***/ }),

/***/ "./src/utils/types.ts":
/*!****************************!*\
  !*** ./src/utils/types.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isIsBlocking": () => (/* binding */ isIsBlocking),
/* harmony export */   "isBlockingTimestamp": () => (/* binding */ isBlockingTimestamp),
/* harmony export */   "isBlockingTimerId": () => (/* binding */ isBlockingTimerId)
/* harmony export */ });
function isIsBlocking(isBlocking) {
    return typeof isBlocking === "boolean";
}
function isBlockingTimestamp(blockingTimestamp) {
    return (
    // blockingTimestamp instanceof Date ||
    blockingTimestamp === null || typeof blockingTimestamp === "string");
}
function isBlockingTimerId(blockingTimerId) {
    return typeof blockingTimerId === "number" || blockingTimerId === null;
}


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
/* harmony import */ var _utils_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/types */ "./src/utils/types.ts");
/* harmony import */ var _utils_promisify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/promisify */ "./src/utils/promisify.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



(function init() {
    return __awaiter(this, void 0, void 0, function () {
        var isBlocking, blockingTimestamp, blockingTimerId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // should always be null, since on unmount it's set to null anyway
                    chrome.storage.local.set({ blockingTimerId: null });
                    return [4 /*yield*/, (0,_utils_promisify__WEBPACK_IMPORTED_MODULE_2__.chromeStorageGet)("isBlocking")];
                case 1:
                    isBlocking = _a.sent();
                    if (isBlocking === undefined) {
                        chrome.storage.local.set({ isBlocking: true });
                    }
                    return [4 /*yield*/, (0,_utils_promisify__WEBPACK_IMPORTED_MODULE_2__.chromeStorageGet)("blockingTimestamp")];
                case 2:
                    blockingTimestamp = _a.sent();
                    if (!(0,_utils_types__WEBPACK_IMPORTED_MODULE_1__.isBlockingTimestamp)(blockingTimestamp)) {
                        throw new TypeError("expected blockingTimestamp, got " + typeof blockingTimestamp);
                    }
                    if (!blockingTimestamp) {
                        setBlockingTimestamp(null);
                        return [2 /*return*/];
                    }
                    // negative timestamp, reset
                    if (new Date(blockingTimestamp).getTime() - Date.now() < 0) {
                        setBlockingTimestamp(null);
                        return [2 /*return*/];
                    }
                    // ongoing timer
                    if (new Date(blockingTimestamp).getTime() - Date.now() >= 0) {
                        blockingTimerId = setTimeout(function () {
                            console.log("BACKEND: in set timeout, setting to null");
                            setBlockingTimestamp(null);
                            setIsBlocking(true);
                            setBlockingTimerId(null);
                        }, new Date(blockingTimestamp).getTime() - Date.now());
                        setBlockingTimerId(blockingTimerId);
                    }
                    return [2 /*return*/];
            }
        });
    });
})();
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
chrome.tabs.onUpdated.addListener(function (tabId, _, tab) { return __awaiter(void 0, void 0, void 0, function () {
    var isBlocking, _i, blockedSites_1, regex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!tab.url)
                    return [2 /*return*/];
                return [4 /*yield*/, (0,_utils_promisify__WEBPACK_IMPORTED_MODULE_2__.chromeStorageGet)("isBlocking")];
            case 1:
                isBlocking = !!(_a.sent());
                if (!(0,_utils_types__WEBPACK_IMPORTED_MODULE_1__.isIsBlocking)(isBlocking)) {
                    throw new TypeError("expected isBlocking, got " + typeof isBlocking);
                }
                if (!isBlocking)
                    return [2 /*return*/];
                // want to run sync, don't want to bother with forEach
                for (_i = 0, blockedSites_1 = _utils_blockedSites__WEBPACK_IMPORTED_MODULE_0__.default; _i < blockedSites_1.length; _i++) {
                    regex = blockedSites_1[_i];
                    if (regex.test(tab.url)) {
                        chrome.tabs.remove(tabId, function () {
                            console.log("BACKEND: removed tab", { tabId: tabId, url: tab.url });
                        });
                        break;
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
// on unmount
chrome.runtime.onSuspend.addListener(function () { return __awaiter(void 0, void 0, void 0, function () {
    var blockingTimerId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0,_utils_promisify__WEBPACK_IMPORTED_MODULE_2__.chromeStorageGet)("blockingTimerId")];
            case 1:
                blockingTimerId = _a.sent();
                if (!(0,_utils_types__WEBPACK_IMPORTED_MODULE_1__.isBlockingTimerId)(blockingTimerId)) {
                    throw new TypeError("expected blockingTimerId, got " + typeof blockingTimerId);
                }
                // if there's a current timer, cancel it, but keep the timestamp
                if (blockingTimerId) {
                    clearTimeout(blockingTimerId);
                }
                setBlockingTimerId(null);
                return [2 /*return*/];
        }
    });
}); });
chrome.runtime.onMessage.addListener(function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, isBlocking, blockingTimestamp, blockingTimerId_1, blockingTimerId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = message.type;
                switch (_a) {
                    case "REQ_IS_BLOCKING_STATUS": return [3 /*break*/, 1];
                    case "TOGGLE_IS_BLOCKING": return [3 /*break*/, 3];
                    case "REQ_BLOCKING_TIMESTAMP": return [3 /*break*/, 4];
                    case "SET_BLOCKING_TIMESTAMP": return [3 /*break*/, 6];
                }
                return [3 /*break*/, 9];
            case 1: return [4 /*yield*/, (0,_utils_promisify__WEBPACK_IMPORTED_MODULE_2__.chromeStorageGet)("isBlocking")];
            case 2:
                isBlocking = _b.sent();
                console.log("BACKEND: received request for blocking status", {
                    isBlocking: isBlocking,
                });
                if (!(0,_utils_types__WEBPACK_IMPORTED_MODULE_1__.isIsBlocking)(isBlocking)) {
                    throw new TypeError("expected isBlocking, got " + typeof isBlocking);
                }
                sendIsBlockingStatus(isBlocking);
                return [3 /*break*/, 10];
            case 3:
                setIsBlocking(message.isBlocking);
                console.log("BACKEND: received request to toggle isBlocking status", {
                    isBlocking: message.isBlocking,
                });
                return [3 /*break*/, 10];
            case 4: return [4 /*yield*/, (0,_utils_promisify__WEBPACK_IMPORTED_MODULE_2__.chromeStorageGet)("blockingTimestamp")];
            case 5:
                blockingTimestamp = _b.sent();
                console.log("BACKEND: received request for blocking timestamp", {
                    blockingTimestamp: blockingTimestamp,
                });
                if (!(0,_utils_types__WEBPACK_IMPORTED_MODULE_1__.isBlockingTimestamp)(blockingTimestamp)) {
                    throw new TypeError("expected isBlockingTimestamp, got " + typeof blockingTimestamp);
                }
                sendBlockingTimestamp(blockingTimestamp);
                return [3 /*break*/, 10];
            case 6:
                console.log("BACKEND: received request to set blocking timestamp", {
                    timestamp: message.timestamp,
                });
                if (!!message.timestamp) return [3 /*break*/, 8];
                console.log("INSIDE if statement for null timestamp");
                setBlockingTimestamp(message.timestamp);
                return [4 /*yield*/, (0,_utils_promisify__WEBPACK_IMPORTED_MODULE_2__.chromeStorageGet)("blockingTimerId")];
            case 7:
                blockingTimerId_1 = _b.sent();
                if (!(0,_utils_types__WEBPACK_IMPORTED_MODULE_1__.isBlockingTimerId)(blockingTimerId_1)) {
                    throw new TypeError("expected blockingTimerId, got " + typeof blockingTimerId_1);
                }
                // if there's a current timer, cancel it
                if (blockingTimerId_1) {
                    clearTimeout(blockingTimerId_1);
                }
                setBlockingTimerId(null);
                return [2 /*return*/];
            case 8:
                console.log("INSIDE: after if statement for null timestamp");
                // if the message sent a real timestamp
                setBlockingTimestamp(message.timestamp);
                blockingTimerId = setTimeout(function () {
                    // once timer finishes
                    console.log("BACKEND: in set timeout, setting to null");
                    setBlockingTimestamp(null);
                    setIsBlocking(true);
                    setBlockingTimerId(null);
                }, new Date(message.timestamp).getTime() - Date.now());
                setBlockingTimerId(blockingTimerId);
                return [3 /*break*/, 10];
            case 9: return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// isBlocking helpers
function sendIsBlockingStatus(isBlocking) {
    var message = { type: "IS_BLOCKING_STATUS", isBlocking: isBlocking };
    chrome.runtime.sendMessage(message);
}
function setIsBlocking(isBlocking) {
    chrome.storage.local.set({ isBlocking: isBlocking });
    sendIsBlockingStatus(isBlocking);
}
// blockingTimestamp helpers
function sendBlockingTimestamp(blockingTimestamp) {
    var message = {
        type: "BLOCKING_TIMESTAMP",
        timestamp: blockingTimestamp,
    };
    chrome.runtime.sendMessage(message);
}
function setBlockingTimestamp(blockingTimestamp) {
    chrome.storage.local.set({ blockingTimestamp: blockingTimestamp });
    sendBlockingTimestamp(blockingTimestamp);
}
// blockingTimerId helpers
function setBlockingTimerId(blockingTimerId) {
    chrome.storage.local.set({ blockingTimerId: blockingTimerId });
}

})();

/******/ })()
;
//# sourceMappingURL=background.js.map