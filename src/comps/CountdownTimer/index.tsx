import React from "react";

interface CountdownTimerProps {
  isBlocking: boolean;
}

export default function CountdownTimer({ isBlocking }: CountdownTimerProps) {
  console.log(isBlocking);
  return <div>confirm timer</div>;
}
