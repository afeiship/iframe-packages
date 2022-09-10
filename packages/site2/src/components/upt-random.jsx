import { useEffect, useState } from 'react';
import { useIfm } from '@jswork/react-iframe-mate';
// import iftTools from 'ift-tools';

export const UptRandom = () => {
  const [v, setV] = useState();
  const { ifm } = useIfm();
  console.log('ifm:', ifm);
  useEffect(() => {
    ifm.update({ setV });
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
