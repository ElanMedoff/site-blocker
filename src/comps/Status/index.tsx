import React from "react";

interface StatusProps {
  isBlocking: boolean;
}

export default function Status({ isBlocking }: StatusProps) {
  return <div>Status: {isBlocking ? "blocking" : "not blocking"}</div>;
}
