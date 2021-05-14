interface IsBlockingRequest {
  type: "REQ_IS_BLOCKING_STATUS";
}

interface IsBlockingResponse {
  type: "IS_BLOCKING_STATUS";
  isBlocking: boolean;
}

interface IsBlockingToggle {
  type: "TOGGLE_IS_BLOCKING";
  isBlocking: boolean;
}

interface BlockingTimestampRequest {
  type: "REQ_BLOCKING_TIMESTAMP";
}

interface BlockingTimestampResponse {
  type: "BLOCKING_TIMESTAMP";
  timestamp: Date | null;
}

interface SetBlockingTimeStamp {
  type: "SET_BLOCKING_TIMESTAMP";
  timestamp: Date | null;
}

export type Message =
  | IsBlockingRequest
  | IsBlockingResponse
  | IsBlockingToggle
  | BlockingTimestampRequest
  | BlockingTimestampResponse
  | SetBlockingTimeStamp;
