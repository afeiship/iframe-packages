export default {
  navigate: (inOptions, ctx) => {
    console.log('parent navigate opts:', inOptions)
    const { navigate } = ctx;
    var url = inOptions.url;
    var delta = inOptions.delta;
    if (delta) {
      navigate(delta);
    } else {
      navigate(url);
    }
  },
};
