import { useContext } from 'react';
import { Context } from '.';

export default (inCtx) => {
  const res = useContext(Context);
  res!.ifm.update(inCtx);
  return res;
};
