import IFMCodecs from '../src';

describe('case1: path/replace/ref', () => {
  test('IFMCodecs encode nav cmd', () => {
    const cmd = {
      command: 'navigate',
      payload: {
        path: '/home',
        options: {
          replace: true,
          referer: 'cas-db',
        },
      },
    };

    const res = IFMCodecs.encode(cmd);
    expect(res).toBe('/home+r+ref~cas-db');
  });

  test('IFMCodecs decode nav cmd', () => {
    const cmd = '/home+r+ref~cas-db';
    const res = IFMCodecs.decode(cmd);
    expect(res).toEqual({
      command: 'navigate',
      payload: {
        path: '/home',
        options: {
          replace: true,
          referer: 'cas-db',
        },
      },
    });
  });
});

describe('case2: only path', () => {
  test('IFMCodecs encode nav cmd', () => {
    const cmd = {
      command: 'navigate',
      payload: {
        path: '/home',
      },
    };

    const res = IFMCodecs.encode(cmd);
    console.log(res);
    expect(res).toBe('/home');
  });

  test('IFMCodecs decode nav cmd', () => {
    const cmd = '/home';
    const res = IFMCodecs.decode(cmd);
    expect(res).toEqual({
      command: 'navigate',
      payload: {
        path: '/home',
      },
    });
  });
});

describe('case3: path + replace', () => {
  test('IFMCodecs encode nav cmd', () => {
    const cmd = {
      command: 'navigate',
      payload: {
        path: '/home',
        options: {
          replace: true,
        },
      },
    };

    const res = IFMCodecs.encode(cmd);
    expect(res).toBe('/home+r');
  });

  test('IFMCodecs decode nav cmd', () => {
    const cmd = '/home+r';
    const res = IFMCodecs.decode(cmd);
    expect(res).toEqual({
      command: 'navigate',
      payload: {
        path: '/home',
        options: {
          replace: true,
        },
      },
    });
  });
});

describe('case4: path + ref', () => {
  test('IFMCodecs encode nav cmd', () => {
    const cmd = {
      command: 'navigate',
      payload: {
        path: '/home',
        options: {
          referer: 'cas-db',
        },
      },
    };

    const res = IFMCodecs.encode(cmd);
    expect(res).toBe('/home+ref~cas-db');
  });

  test('IFMCodecs decode nav cmd', () => {
    const cmd = '/home+ref~cas-db';
    const res = IFMCodecs.decode(cmd);
    expect(res).toEqual({
      command: 'navigate',
      payload: {
        path: '/home',
        options: {
          referer: 'cas-db',
        },
      },
    });
  });
});

describe('case5: input has encode by browser', () => {
  test('IFMCodecs decode nav cmd', () => {
    const cmd = '/home%2Br%2Bref~cas-db';
    const res = IFMCodecs.decode(cmd);
    expect(res).toEqual({
      command: 'navigate',
      payload: {
        path: '/home',
        options: {
          replace: true,
          referer: 'cas-db',
        },
      },
    });
  });
});

describe('case6: input path has special char MATCH/PLUS', () => {
  test('IFMCodecs decode nav cmd', () => {
    const cmd = '/home@PLUS@case-db+ref~cas@MATCH@db';
    const res = IFMCodecs.decode(cmd);
    expect(res).toEqual({
      command: 'navigate',
      payload: {
        path: '/home+case-db',
        options: {
          referer: 'cas~db',
        },
      },
    });
  });

  test('IFMCodecs encode nav cmd', () => {
    const cmd = {
      command: 'navigate',
      payload: {
        path: '/home+case+db',
        options: {
          referer: 'cas~db',
        },
      },
    };

    const res = IFMCodecs.encode(cmd);
    expect(res).toBe('/home@PLUS@case@PLUS@db+ref~cas@MATCH@db');
  });

  test('IFMCodecs decode old version:eyJjb21tYW5kIjoibmF2aWdhdGUiLCJwYXlsb2FkIjp7InBhdGgiOiIvIn19', () => {
    const str = 'eyJjb21tYW5kIjoibmF2aWdhdGUiLCJwYXlsb2FkIjp7InBhdGgiOiIvIn19';
    const res = IFMCodecs.decode(str);
    expect(res).toEqual({
      command: 'navigate',
      payload: {
        path: '/',
      },
    });
  });
});
