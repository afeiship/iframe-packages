const NxJson = require("@jswork/next-json2base64");
const iftTools = {
  ctx: {},
  update: function (obj) {
    Object.assign(iftTools.ctx, obj);
  },
};

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function getTarget() {
  if (isInIframe()) {
    return window.top;
  } else {
    return document.querySelector("iframe").contentWindow;
  }
}

function post(arg, origin = "*") {
  const target = getTarget();
  target.postMessage(arg, origin);

  return new Promise((resolve) => {
    const handler = (e) => {
      window.removeEventListener("message", handler);
      if (e.data.command === `${arg.command}.response`) {
        resolve(e.data.payload);
      }
    };
    window.addEventListener("message", handler);
  });
}

function init(commands, inContext) {
  // url: ift message process
  const uri = new URL(location.href);
  const qs = uri.searchParams;
  const ift = qs.get("ift");
  console.log("ft:", ift);
  if (ift) {
    // todo: 这里分里面的 iframe/外面的 iframe 的情况，目前只考虑外面的 iframe 情况
    const arg = NxJson.decode(ift);
    const iframe = document.querySelector("iframe");
    iframe.onload = function () {
      console.log("loaded.");
      iframe.contentWindow.postMessage(arg, "*");
    };
  }
  iftTools.update(inContext);
  window.addEventListener("message", (e) => {
    for (let command in commands) {
      const v = commands[command];
      if (e.data.command === command) {
        const res = v(e.data.payload, iftTools.ctx);
        post({
          command: `${command}.response`,
          payload: res,
        });
      }
    }
  });
}

iftTools.post = post;
iftTools.init = init;

module.exports = iftTools;
