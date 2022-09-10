import { useEffect, useState } from 'react';
import { useIfm } from '@jswork/react-iframe-mate';
// import iftTools from 'ift-tools';

export const UptRandom = () => {
  const [v, setV] = useState();

  useIfm({ setV });

  return (
    <button
      onClick={(e) => {
        setV(Math.random());
      }}>
      Set random state - {v}
    </button>
  );
};
