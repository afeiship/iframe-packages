import rootDomain from '@jswork/root-domain';
import '@jswork/next';
import '@jswork/next-qs';
import '@jswork/next-is-in-iframe';
import '@jswork/next-json2base64';
import '@jswork/next-wait-to-display';

type Context = Record<string, any>;
type MessageItem = { command: string; persist?: boolean; payload?: any };
type Message = MessageItem | MessageItem[];
type Role = 'child' | 'parent' | 'standalone';

export type CommandRepo = Record<string, (payload: any, ctx: Context) => any>;
export type SupportRouterType = 'hash' | 'browser' | 'hashbang';

export interface Options {
  queryKey?: string;
  routerType?: SupportRouterType;
  debug?: boolean;
  isCorsDomain?: boolean;
  ifmReplace?: boolean;
  times?: number;
}

const defaults: Options = {
  queryKey: 'ifm',
  routerType: 'hash',
  debug: false,
  isCorsDomain: false,
  ifmReplace: false,
  times: 1000,
};

const colors = {
  parent: '#2082bf',
  child: '#97c232',
  standalone: '#8b42d9',
  defaults: '#f17f4a',
};

export default class IframeMate {
  public options: Options;
  public context: Context;

  /**
   * Get current iframe role.
   * parent: As a parent, there must be a child.
   * child: As a child, there must be a parent.
   * standalone: 独立存在，向上/向下，均不存在 iframe 元素
   * @return Role
   */
  get role(): Role {
    const isInIframe = nx.isInIframe();
    if (isInIframe) return 'child';
    return this.contentFrame ? 'parent' : 'standalone';
  }

  /**
   * Detect if current environment is in iframe.
   * @return boolean
   */
  get mateable() {
    return this.role !== 'standalone';
  }

  /**
   * Get current ifm param from url.
   * @return string | undefined
   */
  get ifm(): string | undefined {
    const targetQsUrl =
      this.options.routerType === 'hash'
        ? window.location.hash
        : window.location.href;

    const qs = nx.qs(targetQsUrl);
    const key = this.options.queryKey!;
    return qs[key];
  }

  /**
   * Get current iframe element.
   * @return HTMLIFrameElement | undefined
   */
  get contentFrame(): HTMLIFrameElement {
    return document.querySelector('iframe')!;
  }

  /**
   * Get current window object.
   * @return Window
   */
  get targetWin() {
    switch (this.role) {
      case 'parent':
        return this.contentFrame.contentWindow;
      case 'child':
        return window.parent;
    }
    return window;
  }

  /**
   * Constructor of iframe mate.
   * @param inOptions
   */
  constructor(inOptions: Options) {
    this.options = nx.mix(null, defaults, inOptions);
    this.context = {};
  }

  /**
   * Initialize iframe mate, should be called after dom ready.
   * @param inCommand
   * @param inContext
   */
  init(inCommand: CommandRepo, inContext: Context) {
    // url: ifm message process
    // ifm only appear in parent(init stage will: standalone)
    this.initCorsDomain();

    if (this.ifm) {
      const ifm4msg = nx.Json2base64.decode(this.ifm);
      this.log(this.role, 'init:', ifm4msg);
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
      const handler = inCommand[command];
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
   * Send message instead of postMessage.
   * @param inMessage
   * @param inTargetOrigin
   */
  post(inMessage: Message, inTargetOrigin = '*'): Promise<any> {
    this.log(this.role, inMessage);
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
   * Update command context.
   * @param inObj
   */
  update(inObj: Context) {
    nx.mix(this.context, inObj);
  }

  /**
   * Try to set root domain.
   * @private
   */
  private initCorsDomain() {
    if (!this.options.isCorsDomain) return;
    const domain = rootDomain(window.location.href);

    try {
      document.domain = domain;
      this.log(this.role, 'Set CORS domain success.', domain);
    } catch (e) {
      this.log('exception', e);
    }
  }

  /**
   * Add ifm query string to url.
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
    this.log('ifmp', ifmp, uri.toString());
    window.history[method](null, '', ifmp);
  }

  /**
   * Log info when debug set to true.
   * @param inRole
   * @param args
   * @private
   */
  private log(inRole, ...args) {
    if (this.options.debug) {
      const color = colors[inRole] || colors.defaults;
      console.log(
        `%c[ifm-debug:${inRole}]:`,
        `padding: 1px; border-radius: 3px; color: #fff; background: ${color};`,
        ...args
      );
    }
  }
}
