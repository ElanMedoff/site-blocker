import React from "react";

interface ConfirmTimerProps {
  isBlocking: boolean;
}

export default function ConfirmTimer({ isBlocking }: ConfirmTimerProps) {
  console.log(isBlocking);
  return <div>confirm timer</div>;
}
