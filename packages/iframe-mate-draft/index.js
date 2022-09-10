const nx = require("@jswork/next");
const NxJson2base64 = require("@jswork/next-json2base64");
const nxQs = require("@jswork/next-qs");
const nxIsInIframe = require("@jswork/next-is-in-iframe");

function colorLog() {
  console.log(
    "%c[ifm-debug]:",
    "padding: 1px; border-radius: 3px; color: #fff; background: #d5624f;",
    ...arguments
  );
}

const defaults = {
  queryKey: "ifm",
  routerType: "hash", // hash | browser
  debug: true,
};

module.exports = class IframeMate {
  constructor(inOptions) {
    this.options = nx.mix(null, defaults, inOptions);
    this.context = {};
  }

  get ifm() {
    const targetQsUrl =
      this.options.routerType === "hash"
        ? window.location.hash
        : window.location.url;
    const qs = nx.qs(targetQsUrl);
    return qs[this.options.queryKey];
  }

  get contentFrame() {
    return document.querySelector("iframe");
  }

  get targetWin() {
    if (nxIsInIframe()) {
      return window.top;
    } else {
      return this.contentFrame.contentWindow;
    }
  }

  init(inCommands, inContext) {
    // url: ifm message process
    if (this.ifm) {
      const ifmMessage = NxJson2base64.decode(this.ifm);
      this.contentFrame.addEventListener("load", () => {
        this.post(ifmMessage);
      });
    }

    // init commands context
    this.update(inContext);

    window.addEventListener("message", (e) => {
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

  // message: { command: 'navigate', payload: {} }
  post(inMessage, inTargetOrigin = "*") {
    this.options.debug && colorLog(inMessage);
    const isSingle = !Array.isArray(inMessage);
    const message = isSingle ? [inMessage] : inMessage;
    const results = message.map((msg) => {
      this.targetWin.postMessage(msg, inTargetOrigin);
      return new Promise((resolve, reject) => {
        const handler = (e) => {
          window.removeEventListener("message", handler);
          if (e.data.command === `${msg.command}.response`) {
            try {
              resolve(e.data.payload);
            } catch (e) {
              reject(e);
            }
          }
        };
        window.addEventListener("message", handler);
      });
    });

    return isSingle ? results[0] : results;
  }

  update(inObj) {
    nx.mix(this.context, inObj);
  }
};
