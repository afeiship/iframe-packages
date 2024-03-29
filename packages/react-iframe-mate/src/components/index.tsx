import React, { Component, ReactNode, useContext } from 'react';
import nx from '@jswork/next';
import IframeMate from '@jswork/iframe-mate';
import insertCss from 'insert-css';
import type { Options, CommandRepo } from '@jswork/iframe-mate';
import '@jswork/next-wait-to-display';

export const IFMContext = React.createContext<{ ifm: IframeMate } | null>(null);
const styles = `
  [data-disabled="true"] {
    cursor: not-allowed;
    opacity:0.6;
  }
`;

type ReactIframeMateProps = Options & {
  commands: CommandRepo;
  ready?: (ifmInstance: IframeMate) => void;
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
  static defaultProps = {
    harmony: false,
    ready: (ifmInstance) => {
      const selector = 'input[name="IFM_READY"]';
      nx.waitToDisplay(selector, 200, () => ifmInstance.post({ command: IframeMate.READY_MSG }));
    }
  };
  state = { instance: null };

  componentDidMount() {
    const { commands, context, harmony, ready, ...options } = this.props;
    const instance = new IframeMate(options);
    instance.init(commands, context);
    ready!(instance);
    insertCss(styles);
    if (harmony) nx.set(nx, '$ifm', instance);
    this.setState({ instance });
  }

  render() {
    const { children } = this.props;
    const { instance } = this.state;
    if (!instance) return null;
    return (
      <IFMContext.Provider value={{ ifm: instance }}>
        {children}
        <input type="hidden" name="IFM_READY" />
      </IFMContext.Provider>
    );
  }
}
