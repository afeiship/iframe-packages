import rootDomain from '@jswork/root-domain';
import '@jswork/next';
import '@jswork/next-qs';
import '@jswork/next-is-in-iframe';
import '@jswork/next-json2base64';
import '@jswork/next-wait-to-display';
import '@jswork/next-url-watcher';

type Context = Record<string, any>;
type MessageItem = { command: string; payload?: any };
type Message = MessageItem | MessageItem[];
type Role = 'child' | 'parent' | 'standalone';
type PostOptions = { origin?: string };
type Destroyable = { destroy: () => void };

export type CommandRepo = Record<string, (payload: any, ctx: Context) => any>;
export type SupportRouterType = 'hash' | 'browser' | 'hashbang';

export interface Options {
  queryKey?: string;
  routerType?: SupportRouterType;
  debug?: boolean;
  isCorsDomain?: boolean;
  times?: number;
}

const ifmDebug =
  process.env.NODE_ENV === 'development' ||
  localStorage.getItem('__IFM_DEBUG__') === 'true';

const defaults: Options = {
  queryKey: 'ifm',
  routerType: 'hash',
  debug: ifmDebug,
  isCorsDomain: false,
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
  public encode = nx.Json2base64.encode;
  public decode = nx.Json2base64.decode;
  public urlWatcher = new nx.UrlWatcher();

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
   * @param inCommands
   * @param inContext
   */
  init(inCommands: CommandRepo, inContext: Context) {
    // url: ifm message process
    // ifm only appear in parent(init stage will: standalone)
    this.initCorsDomain();
    this.initIFMMessage();
    this.initURLWatcher();

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
   * Send message instead of postMessage.
   * @param inMessage
   * @param inOptions
   */
  post(inMessage: Message, inOptions?: PostOptions): Promise<any> {
    this.log('Current message is: ', inMessage);
    const isSingle = !Array.isArray(inMessage);
    const message = isSingle ? [inMessage] : inMessage;
    const targetWin = this.targetWin;
    const isMate = this.role !== 'standalone';
    if (!isMate || !targetWin) return Promise.resolve(null);

    const results = message.map((msg) => {
      targetWin.postMessage(msg, inOptions?.origin || '*');
      return new Promise((resolve, reject) => {
        const handler = (e) => {
          const cmd = e.data.command;
          const respCmd = `${msg.command}.response`;
          const isResponse = cmd === respCmd;
          if (isResponse) {
            try {
              resolve(e.data.payload);
            } catch (e) {
              reject(e);
            } finally {
              window.removeEventListener('message', handler);
            }
          }
        };
        window.addEventListener('message', handler);
      });
    });

    return isSingle ? results[0] : Promise.all(results);
  }

  /**
   * Send message instead of postMessage(Alias of post).
   * @param inMessage
   * @param inOptions
   */
  emit(inMessage: Message, inOptions?: PostOptions): Promise<any> {
    return this.post(inMessage, inOptions);
  }

  /**
   * Listen message which triggered by ifm command.
   * @param inCommand
   * @param inHandler
   */
  on(
    inCommand: string,
    inHandler: (payload: any, ctx: Context) => any
  ): Destroyable {
    const handler = (e: MessageEvent<MessageItem>) => {
      const { command, payload } = e.data;
      const shouldHandle = command === inCommand || command === '*';
      if (shouldHandle) inHandler(payload, this.context);
    };

    window.addEventListener('message', handler);
    return {
      destroy: () => {
        window.removeEventListener('message', handler);
      },
    };
  }

  /**
   * Update command context.
   * @param inObj
   */
  update(inObj: Context) {
    nx.mix(this.context, inObj);
  }

  /**
   * Process message in url which contains `ifm`.
   * @private
   */
  private initIFMMessage() {
    this.log('Current ifm is: ', this.ifm);
    const handler = (e: MessageEvent<MessageItem>) => {
      if (!this.ifm) return;
      const { command } = e.data;
      if (command === 'ready') this.postIFM(e.data);
    };
    window.addEventListener('message', handler);
  }

  private initURLWatcher() {
    this.urlWatcher.watch((previous, current) => {
      if (!this.ifm) return;
      this.postIFM({ command: 'ready' });
    });
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
      this.log('Set CORS domain success.', domain);
    } catch (e) {
      this.log('Set CORS domain failed', e);
    }
  }

  /**
   * Post message to parent window.
   * @param inMessage
   * @param inOptions
   * @private
   */
  private postIFM(
    inMessage: MessageItem,
    inOptions?: PostOptions
  ): Promise<any> {
    const ifm4msg = nx.Json2base64.decode(this.ifm!);
    return this.post(ifm4msg, inOptions);
  }

  /**
   * Log info when debug set to true.
   * @param inArgs
   * @private
   */
  private log(...inArgs) {
    if (this.options.debug) {
      const color = colors[this.role] || colors.defaults;
      console.log(
        `%c[ifm-debug:${this.role}]:`,
        `padding: 1px; border-radius: 3px; color: #fff; background: ${color};`,
        ...inArgs
      );
    }
  }
}
