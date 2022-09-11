import React, { Component, ReactNode, useContext } from 'react';
import IframeMate from '@jswork/iframe-mate';
import type { Options } from '@jswork/iframe-mate';

export const Context = React.createContext<{ ifm: IframeMate } | null>(null);
export const useIfm = (inCtx?) => {
  const res = useContext(Context);
  if (inCtx) res!.ifm.update(inCtx);
  return res;
};

type ReactIframeMateProps = Options & {
  commands: any[];
  context?: any;
  children: ReactNode;
};

type ReactIframeState = {
  instance: IframeMate | null;
};

export default class ReactIframeMate extends Component<ReactIframeMateProps, ReactIframeState> {
  static defaultProps = {};
  state = { instance: null };

  componentDidMount() {
    const { commands, context, ...options } = this.props;
    const instance = new IframeMate(options);
    instance.init(commands, context);
    this.setState({ instance });
  }

  render() {
    const { children } = this.props;
    const { instance } = this.state;
    if (!instance) return null;
    return <Context.Provider value={{ ifm: instance }}>{children}</Context.Provider>;
  }
}
