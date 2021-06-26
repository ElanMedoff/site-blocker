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
  timestamp: string | null;
}

interface SetBlockingTimeStamp {
  type: "SET_BLOCKING_TIMESTAMP";
  timestamp: string | null;
}

interface BackendState {
  isBlocking: boolean;
  blockingTimestamp: string | null;
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

export function isBlockingTimestamp(
  blockingTimestamp: any
): blockingTimestamp is string | null {
  return blockingTimestamp === null || typeof blockingTimestamp === "string";
}

export function isBlockingTimerId(
  blockingTimerId: any
): blockingTimerId is number | null {
  return typeof blockingTimerId === "number" || blockingTimerId === null;
}
