import { useEffect, useState } from 'react';
// import iftTools from 'ift-tools';

export const UptRandom = () => {
  const [v, setV] = useState();
  useEffect(() => {
    ifmate.update({ setV });
  }, []);
  return (
    <button
      onClick={(e) => {
        setV(Math.random());
      }}>
      Set random state - {v}
    </button>
  );
};
