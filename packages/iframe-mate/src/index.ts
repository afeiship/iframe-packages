import { log } from './misc';
import '@jswork/next';
import '@jswork/next-qs';
import '@jswork/next-is-in-iframe';
import '@jswork/next-json2base64';
import '@jswork/next-wait-to-display';

type Context = Record<string, any>;
type MessageItem = { command: string; persist?: boolean; payload?: any };
type Message = MessageItem | MessageItem[];
type Command = Record<string, (ctx: any, ...args: any[]) => any>;
type Role = 'child' | 'parent' | 'standalone';

export type SupportRouterType = 'hash' | 'browser' | 'hashbang';

export interface Options {
  queryKey?: string;
  routerType?: SupportRouterType;
  debug?: boolean;
  ifmReplace?: boolean;
  times?: number;
}

const defaults: Options = {
  queryKey: 'ifm',
  routerType: 'hash',
  debug: false,
  ifmReplace: false,
  times: 1000,
};

export default class IframeMate {
  public options: Options;
  public context: Context;

  get role(): Role {
    const isInIframe = nx.isInIframe();
    if (isInIframe) return 'child';
    return this.contentFrame ? 'parent' : 'standalone';
  }

  get mateable() {
    return this.role !== 'standalone';
  }

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
    switch (this.role) {
      case 'parent':
        return this.contentFrame.contentWindow;
      case 'child':
        return window.top;
    }
    return window;
  }

  constructor(inOptions: Options) {
    this.options = nx.mix(null, defaults, inOptions);
    this.context = {};
  }

  /**
   * 初始化
   * @param inCommands
   * @param inContext
   */
  init(inCommands: Command[], inContext: Context) {
    // url: ifm message process
    // ifm only appear in parent(init stage will: standalone)
    if (this.ifm) {
      const ifm4msg = nx.Json2base64.decode(this.ifm);
      log(this.role, 'init:', ifm4msg);
      nx.waitToDisplay(
        'iframe',
        200,
        () => {
          this.contentFrame.addEventListener('load', () => {
            this.post(ifm4msg);
          });
        },
        this.options.times
      );
    }

    // init commands context
    inContext && this.update(inContext);

    window.addEventListener('message', (e: MessageEvent<MessageItem>) => {
      const { command, payload } = e.data;
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

  /**
   * 发送消息
   * @param inMessage
   * @param inTargetOrigin
   */
  post(inMessage: Message, inTargetOrigin = '*'): Promise<any> {
    this.options.debug && log(this.role, inMessage);
    const isSingle = !Array.isArray(inMessage);
    const message = isSingle ? [inMessage] : inMessage;
    const targetWin = this.targetWin;
    if (!this.mateable || !targetWin) return Promise.resolve(null);

    const results = message.map((msg) => {
      targetWin.postMessage(msg, inTargetOrigin);

      if (msg.persist) {
        delete msg.persist;
        const url = window.location.href;
        const ifmString = nx.Json2base64.encode(msg);
        this.updateIFM(url, ifmString);
      }

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

  /**
   * 更新上下文
   * @param inObj
   */
  update(inObj: Context) {
    nx.mix(this.context, inObj);
  }

  /**
   * 将 URL 后面添国 ?ifm=xyz 字符串参数
   * @param inUrl
   * @param inValue
   */
  private updateIFM(inUrl: string, inValue: string) {
    const method = this.options.ifmReplace ? 'replaceState' : 'pushState';
    const hashurl = `https://js.work` + inUrl.split('#')[1];
    const url = inUrl.includes('#') ? hashurl : inUrl;
    const uri = new URL(url);
    uri.searchParams.set('ifm', inValue);
    const ifmp = uri.pathname + uri.search;
    log('ifmp', ifmp, uri.toString());
    window.history[method](null, '', ifmp);
  }
}
