import nx from '@jswork/next';
import '@jswork/next-json2base64';

const isEmptyObj = (inObj: any) => Object.keys(inObj).length === 0;

export default class {
  public static encode(inData: any) {
    const { command, payload } = inData;
    if (command !== 'navigate') return nx.Json2base64.encode(inData);
    const { path, options } = payload;
    let res = path;
    if (!options) return res;

    const { replace, referer } = options;
    if (replace) res += '+r';
    if (referer) res += `+ref~${referer}`;
    return res;
  }

  public static decode(inData: string) {
    let res;
    try {
      res = nx.Json2base64.decode(inData);
    } catch (_) {
      const [path, ...codecs] = decodeURIComponent(inData).split('+');
      const options: any = {};
      codecs.forEach((key) => {
        if (key.includes('ref~')) options.referer = key.split('~')[1];
        if (key === 'r') options.replace = true;
      });

      const payload = isEmptyObj(options) ? { path } : { path, options };
      res = { command: 'navigate', payload };
    }
    return res;
  }
}
