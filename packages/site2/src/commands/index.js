export default {
  updateRandom: function (inOptions, inContext) {
    const { setV } = inContext;
    setV('from parent: ' + Math.random());
  },
};
