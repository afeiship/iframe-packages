export default {
  navigate: (inOptions, ctx) => {
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
