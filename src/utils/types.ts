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

interface BackendState {
  isBlocking: boolean;
  blockingTimestamp: Date | null;
  blockingTimerId: number | null;
}

export type Message =
  | IsBlockingRequest
  | IsBlockingResponse
  | IsBlockingToggle
  | BlockingTimestampRequest
  | BlockingTimestampResponse
  | SetBlockingTimeStamp;

export type { BackendState };

export function isIsBlocking(isBlocking: any): isBlocking is boolean {
  return typeof isBlocking === "boolean";
}

// TODO figure out when to use Date, and when to use string, seems pretty weird rn
export function isBlockingTimestamp(
  blockingTimestamp: any
): blockingTimestamp is Date | null | string {
  return (
    blockingTimestamp instanceof Date ||
    blockingTimestamp === null ||
    typeof blockingTimestamp === "string"
  );
}

export function isBlockingTimerId(
  blockingTimerId: any
): blockingTimerId is number | null {
  return typeof blockingTimerId === "number" || blockingTimerId === null;
}
