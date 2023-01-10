import React, { useEffect, useState } from 'react';
import { useIfm } from '@jswork/react-iframe-mate';

export default (props) => {
  const { path, children, referer, onClick, to, ...rest } = props;
  const ifm = useIfm().ifm;
  const [rel, setRel] = useState(null);
  const ifmstr = ifm.encode({
    command: 'navigate',
    payload: {
      path: to,
      options: {
        replace: true,
      },
    },
  });
  const target = path + '?ifm=' + ifmstr;

  const handleClick = (e) => {
    e.preventDefault();
    console.log('target: ', target);
    ifm.post({
      command: 'navigate',
      payload: {
        path: target,
      },
    });

    // ifm.navigate({
    //   path,
    //   sub: to,
    //   referer,
    //   replace: false,
    // });

    // ifm.post({
    //   command: 'navigate',
    //   payload: {
    //     path: path,
    //     options: {
    //       replace: true,
    //     },
    //   },
    // });

    onClick && onClick(e);
  };

  useEffect(() => {
    ifm
      .post({
        command: 'url',
      })
      .then((res) => {
        const uri = new URL(res);
        setRel(uri.origin);
      });
  }, []);

  return (
    <a href={`${rel}${target}`} {...rest} onClick={handleClick}>
      {children}
    </a>
  );
};
