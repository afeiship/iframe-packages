const nx = require("@jswork/next");
const NxJson2base64 = require("@jswork/next-json2base64");
const nxQs = require("@jswork/next-qs");
const nxIsInIframe = require("@jswork/next-is-in-iframe");
const defaults = {
  routerType: "hash", // hash | browser
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
    return qs.ifm;
  }

  get targetWin() {
    if (nxIsInIframe()) {
      return window.top;
    } else {
      return document.querySelector("iframe").contentWindow;
    }
  }

  init(inCommands, inContext) {
    // url: ifm message process
    if (this.ifm) {
      const ifmMessage = NxJson2base64.decode(this.ifm);
      // ignore response
      this.post(ifmMessage);
    }

    // update context
    this.update(inContext);

    window.addEventListener("message", (e) => {
      const { command, payload } = e.data;
      const handler = inCommands[command];
      if (handler) {
        const res = Promise.resolve(handler(payload, this.context));
        res.then((rv) => {
          this.post({
            command: `${command}.response`,
            payload: rv,
          });
        });
      }
    });
  }

  // message: { command: 'navigate', payload: {} }
  post(inMessage, inTargetOrigin = "*") {
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
