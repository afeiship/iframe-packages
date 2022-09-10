import { useContext } from 'react';
import { Context } from '.';

export default (inCtx?) => {
  const res = useContext(Context);
  if (inCtx) res!.ifm.update(inCtx);
  return res;
};
