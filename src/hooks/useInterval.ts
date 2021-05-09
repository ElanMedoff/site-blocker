import { useEffect, useRef } from "react";

export default function useInterval(
  callback: (clear: () => void) => void,
  delay: number
) {
  const savedCallback = useRef<Function | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  let id: NodeJS.Timeout | null = null;

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      if (typeof savedCallback.current !== "function") return;
      savedCallback.current(() => clearInterval(id as NodeJS.Timeout));
    };

    id = setInterval(tick, delay);
    return () => clearInterval(id as NodeJS.Timeout);
  }, [delay]);
}
