export default {
  updateRandom: function (inOptions, inContext) {
    const { setV } = inContext;
    const v = Math.random();
    setV('from parent: ' + v);
    return v;
  },
  navigate: (inOptions, inContext) => {
    const { navigate } = inContext;
    navigate(inOptions.path);
  },
};
