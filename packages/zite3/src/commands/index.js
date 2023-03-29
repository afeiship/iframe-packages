export default {
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
  }
};
