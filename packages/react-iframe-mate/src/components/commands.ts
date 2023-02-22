import { NavigateFunction } from 'react-router-dom';
import { NavigateOptions } from 'react-router';
import { CommandRepo } from '@jswork/iframe-mate';

type IContext = {
  navigate: NavigateFunction;
};

type NavigatePayload = {
  path: string;
  referer?: string;
  options?: NavigateOptions;
  delta?: number;
} & Record<string, any>;

export default {
  navigate: (payload: NavigatePayload, context: IContext) => {
    const { path, options, delta } = payload;
    const { navigate } = context;
    return delta ? navigate(delta) : navigate(path || '/', options);
  },

  url: () => window.location.href
} as CommandRepo;
