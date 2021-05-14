import React from "react";
import styles from "./Status.module.css";

interface StatusProps {
  isBlocking: boolean;
  startConfirmCountdown: boolean;
  isButtonReady: boolean;
}

export default function Status({
  isBlocking,
  startConfirmCountdown,
  isButtonReady,
}: StatusProps) {
  const renderStatus = () => {
    if (startConfirmCountdown || isButtonReady) {
      return <div className={styles.orange}>are you sure?</div>;
    } else if (isBlocking) {
      return <div className={styles.green}>blocking</div>;
    } else {
      return <div className={styles.red}>not blocking</div>;
    }
  };

  return (
    <div className={styles.status}>
      Status:
      <span className={styles.italic}>{renderStatus()}</span>
    </div>
  );
}
