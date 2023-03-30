import nx from '@jswork/next';
import flip from '@jswork/flip-kv';
import '@jswork/next-json2base64';

/**
 * 此功能是针对 iframe-mate 的特殊需求，用于处理路径中的特殊字符。
 * 1. 原来的 url 中 ifm 表现如下：
 *  ifm=eyJjb21tYW5kIjoibmF2aWdhdGUiLCJwYXlsb2FkIjp7InBhdGgiOiIvIn19
 *  存在问题：语义化不强，不利于调试。
 * 2. 改进后的形式如下：
 *  ifm=/+ref~casdb+r
 * 语义化更强，更利于调试。
 * 3. 各字段说明:
 *  ifm=/: 这段表示子项目的 path 是 /
 *  ifm=+ref~casdb: 这段表示 referer 是 casdb
 *  ifm=+r: 这段表示 replace 是 true
 * 4. 还存在一种 case: 我们在 referer 或者 path 中会出现 + 或者 ~
 *  这种情况下，我们需要对其进行转义，转义规则如下：
 *  + -> @PLUS@
 *  ~ -> @MATCH@
 */

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
