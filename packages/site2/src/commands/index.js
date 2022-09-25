export default {
  updateRandom: function (inPayload, inContext) {
    const { setV } = inContext;
    const v = inPayload || Math.random();
    setV('from parent: ' + v);
    return v;
  },
  navigate: (palyload, ctx) => {
    const { navigate } = ctx;
    var path = palyload.path;
    var opts = palyload.options;
    var delta = palyload.delta;
    if (delta) {
      navigate(delta);
    } else {
      navigate(path, opts);
    }
  },
  tabKey: (inPayload, inContext) => {
    console.log('opts: ', inPayload, inContext);
    const { setTabKey } = inContext;
    setTabKey(inPayload);
  },
};
