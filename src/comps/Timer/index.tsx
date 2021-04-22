import React, { useState, useEffect } from "react";
import useInterval from "../../hooks/useInterval";

export default function Timer({ onComplete }: { onComplete: () => void }) {
  const [minute, setMinute] = React.useState(1);
  const [second, setSecond] = React.useState(10);

  useInterval(() => {
    if (second === 0 && minute === 0) {
      onComplete();
    } else if (second === 0) {
      setSecond(59);
      setMinute((prev) => prev - 1);
    } else {
      setSecond((prev) => prev - 1);
    }
  }, 1000);

  const formattedSecond = second.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const formattedMinute = minute.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return (
    <div>
      {formattedMinute}:{formattedSecond}
    </div>
  );
}
