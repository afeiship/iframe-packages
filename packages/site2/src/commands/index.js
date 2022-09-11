export default {
  updateRandom: function (inPayload, inContext) {
    const { setV } = inContext;
    const v = inPayload || Math.random();
    setV('from parent: ' + v);
    return v;
  },
  navigate: (inPayload, inContext) => {
    const { navigate } = inContext;
    navigate(inPayload.path);
  },

  tabKey: (inPayload, inContext) => {
    console.log('opts: ', inPayload, inContext);
    const { setTabKey } = inContext;
    setTabKey(inPayload);
  },
};
