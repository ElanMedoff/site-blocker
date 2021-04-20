interface IsBlockingRequest {
  type: "REQ_IS_BLOCKING_STATUS";
}

// Background script broadcasting current status
interface IsBlockingResponse {
  type: "IS_BLOCKING_STATUS";
  isBlocking: boolean;
}

// Popup requesting background script for status change
interface IsBlockingToggle {
  type: "TOGGLE_IS_BLOCKING";
  isBlocking: boolean;
}

export type Message = IsBlockingRequest | IsBlockingResponse | IsBlockingToggle;
