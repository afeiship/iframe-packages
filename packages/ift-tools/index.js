function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function post(arg, origin = "*") {
  const res = isInIframe();
  if (res) {
    window.top.postMessage(arg, origin);
  } else {
    const el = document.querySelector("iframe");
    el.contentWindow.postMessage(arg, origin);
  }
}

function init(commands, ctx) {
  window.addEventListener("message", (e) => {
    for (let command in commands) {
      const v = commands[command];
      if (e.data.command === command) {
        v(e.data.payload, ctx);
      }
    }
  });
}

module.exports = { isInIframe, post, init };
