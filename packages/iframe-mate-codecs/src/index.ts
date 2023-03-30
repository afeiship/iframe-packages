import nx from '@jswork/next';
import flip from '@jswork/flip-kv';
import '@jswork/next-json2base64';

const SPECIAL_CHARS = { '@PLUS@': '+', '@MATCH@': '~' };
const isEmptyObj = (inObj: any) => Object.keys(inObj).length === 0;
const replacer = (inPath: string, isFlip?: boolean) => {
  if (!inPath) return inPath;
  const data = isFlip ? flip(SPECIAL_CHARS) : SPECIAL_CHARS;
  const keys = Object.keys(data);
  return keys.reduce((acc, key) => {
    const reKey = isFlip ? `\\` + key : key;
    return acc.replace(new RegExp(reKey, 'g'), data[key]);
  }, inPath);
};

export default class {
  public static encode(inData: any) {
    const { command, payload } = inData;
    if (command !== 'navigate') return nx.Json2base64.encode(inData);
    const { path, options } = payload;
    let res = replacer(path, true);
    // replace special chars:
    if (!options) return res;

    const { replace, referer } = options;
    const _referer = replacer(referer, true);
    if (replace) res += '+r';
    if (referer) res += `+ref~${_referer}`;
    return res;
  }

  public static decode(inString: string) {
    const isNavCmd = inString.startsWith('/');
    if (!isNavCmd) return nx.Json2base64.decode(inString);
    const [_path, ...codecs] = decodeURIComponent(inString).split('+');
    const options: any = {};
    codecs.forEach((key) => {
      if (key.includes('ref~')) options.referer = replacer(key.split('~')[1]);
      if (key === 'r') options.replace = true;
    });

    // replace special chars:
    const path = replacer(_path);
    const payload = isEmptyObj(options) ? { path } : { path, options };
    return { command: 'navigate', payload };
  }
}
