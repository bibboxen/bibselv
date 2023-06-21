import React, { useEffect, useState } from "react";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
  }, []);

  return (
    <>
      <div className="current-time">{currentTime.toLocaleTimeString()}</div>
    </>
  );
};

export default Clock;
