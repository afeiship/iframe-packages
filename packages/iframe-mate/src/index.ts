import '@jswork/next';
import '@jswork/next-qs';
import '@jswork/next-is-in-iframe';
import '@jswork/next-json2base64';

type Context = Record<string, any>;
type MessageItem = { command: string; payload?: any };
type Message = MessageItem | MessageItem[];
type Command = Record<string, (ctx: any, ...args: any[]) => any>;

interface Options {
  queryKey?: string;
  routerType?: 'hash' | 'browser';
  debug?: boolean;
}

const defaults: Options = {
  queryKey: 'ifm',
  routerType: 'hash',
  debug: false,
};

const log = (...args) => {
  console.log(
    '%c[ifm-debug]:',
    'padding: 1px; border-radius: 3px; color: #fff; background: #d5624f;',
    ...args
  );
};

export default class IframeMate {
  public options: Options;
  public context: Context;

  get ifm(): string | undefined {
    const targetQsUrl =
      this.options.routerType === 'hash'
        ? window.location.hash
        : window.location.href;

    const qs = nx.qs(targetQsUrl);
    const key = this.options.queryKey!;
    return qs[key];
  }

  get contentFrame(): HTMLIFrameElement {
    return document.querySelector('iframe')!;
  }

  get targetWin() {
    if (nx.isInIframe()) return this.contentFrame.contentWindow;
    return window.top;
  }

  constructor(inOptions: Options) {
    this.options = nx.mix(null, defaults, inOptions);
    this.context = {};
  }

  init(inCommands: Command[], inContext: Context) {
    // url: ifm message process
    if (this.ifm) {
      const ifmMessage = nx.Json2base64.decode(this.ifm);
      this.contentFrame.addEventListener('load', () => {
        this.post(ifmMessage);
      });
    }

    // init commands context
    this.update(inContext);

    window.addEventListener('message', (e) => {
      const { command, payload } = e.data as MessageItem;
      const handler = inCommands[command];
      if (handler) {
        const res = Promise.resolve(handler(payload, this.context));
        res.then((ret) => {
          this.post({
            command: `${command}.response`,
            payload: ret,
          });
        });
      }
    });
  }

  post(inMessage: Message, inTargetOrigin = '*'): Promise<any> {
    this.options.debug && log(inMessage);
    const isSingle = !Array.isArray(inMessage);
    const message = isSingle ? [inMessage] : inMessage;
    const targetWin = this.targetWin;
    if (!targetWin) return Promise.resolve(null);

    const results = message.map((msg) => {
      targetWin.postMessage(msg, inTargetOrigin);
      return new Promise((resolve, reject) => {
        const handler = (e) => {
          window.removeEventListener('message', handler);
          if (e.data.command === `${msg.command}.response`) {
            try {
              resolve(e.data.payload);
            } catch (e) {
              reject(e);
            }
          }
        };
        window.addEventListener('message', handler);
      });
    });

    return isSingle ? results[0] : Promise.all(results);
  }

  update(inObj: Context) {
    nx.mix(this.context, inObj);
  }
}
