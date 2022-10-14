export default {
  navigate: (palyload, ctx) => {
    console.log('parent navigate opts:', palyload);
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
  back: (payload, ctx) => {
    ctx.navigate(-1);
  },
  forward: (payload, ctx) => {
    ctx.navigate(1);
  },
};
