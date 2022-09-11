import React, { Component, ReactNode, useContext } from 'react';
import IframeMate from '@jswork/iframe-mate';
import type { Options } from '@jswork/iframe-mate';

const IFMContext = React.createContext<{ ifm: IframeMate } | null>(null);

type ReactIframeMateProps = Options & {
  commands: any[];
  context?: any;
  harmony?: boolean;
  children: ReactNode;
};

type ReactIframeState = {
  instance: IframeMate | null;
};

export const useIfm = (inCtx?) => {
  const res = useContext(IFMContext);
  if (inCtx) res!.ifm.update(inCtx);
  return res;
};

export default class ReactIframeMate extends Component<ReactIframeMateProps, ReactIframeState> {
  static defaultProps = { harmony: false };
  state = { instance: null };

  componentDidMount() {
    const { commands, context, harmony, ...options } = this.props;
    const instance = new IframeMate(options);
    const harmonyCtx = window['nx'];
    instance.init(commands, context);
    if (harmony && harmonyCtx) harmonyCtx.set(harmonyCtx, '$ifm', instance);
    this.setState({ instance });
  }

  render() {
    const { children } = this.props;
    const { instance } = this.state;
    if (!instance) return null;
    return <IFMContext.Provider value={{ ifm: instance }}>{children}</IFMContext.Provider>;
  }
}
