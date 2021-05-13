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

interface StartBlockingTimestampRequest {
  type: "REQ_START_BLOCKING_TIMESTAMP";
}

interface StartBlockingTimestampResponse {
  type: "START_BLOCKING_TIMESTAMP";
  timestamp: Date | null;
}

interface SetStartBlockingTimeStamp {
  type: "SET_START_BLOCKING_TIMESTAMP";
  timestamp: Date;
}

export type Message =
  | IsBlockingRequest
  | IsBlockingResponse
  | IsBlockingToggle
  | StartBlockingTimestampRequest
  | StartBlockingTimestampResponse
  | SetStartBlockingTimeStamp;
