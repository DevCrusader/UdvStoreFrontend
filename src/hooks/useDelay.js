import React, { useState } from "react";

const useDelay = (func = (f) => f, intialDelay = 1500) => {
  const [data, setData] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleDelay = (...args) => {
    if (timeoutId) clearTimeout(timeoutId);

    setTimeoutId(setTimeout(() => setData(func(args)), intialDelay));
  };

  return [handleDelay, data];
};

export default useDelay;
