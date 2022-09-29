import { useEffect, useRef } from "react";

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export default function useInterval(
  callback: (clear: () => void) => void,
  delay: number
) {
  const savedCallback = useRef<Function | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  let id: NodeJS.Timeout | null = null;

  useEffect(() => {
    const tick = () => {
      if (typeof savedCallback.current !== "function") return;
      savedCallback.current(() => clearInterval(id as NodeJS.Timeout));
    };

    id = setInterval(tick, delay);
    return () => clearInterval(id as NodeJS.Timeout);
  }, [delay]);
}
