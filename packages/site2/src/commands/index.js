export default {
  updateRandom: function (inOptions, inContext) {
    const { setV } = inContext;
    const v = Math.random();
    setV('from parent: ' + v);
    console.log('set?')
    return v;
  },
};
