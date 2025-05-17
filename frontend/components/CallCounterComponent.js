import React, { useState, useEffect, useRef } from 'react';

export const CallCounter = ({ isActive: externalActive, onTimeUpdate }) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(externalActive ?? true); // Auto-start
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const updatedTime = prevTime + 1;
          if (onTimeUpdate) onTimeUpdate(updatedTime);
          return updatedTime;
        });
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  useEffect(() => {
    if (externalActive !== undefined) {
      setIsActive(externalActive);
    }
  }, [externalActive]);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <>{formatTime(time)}</>
  );
};