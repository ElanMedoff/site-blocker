import React from "react";
import styles from "./Status.module.css";

interface StatusProps {
  isBlocking: boolean;
}

export default function Status({ isBlocking }: StatusProps) {
  return (
    <div className={styles.status}>
      Status:{" "}
      {isBlocking ? (
        <div className={styles.green}>blocking</div>
      ) : (
        <div className={styles.red}>not blocking</div>
      )}
    </div>
  );
}
