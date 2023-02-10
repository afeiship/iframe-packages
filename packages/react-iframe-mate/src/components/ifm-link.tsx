import React, { useEffect, useState } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { useIfm } from '.';

export interface IfmLinkProps extends Omit<LinkProps, 'to'> {
  path: string;
  to?: string;
  children: React.ReactNode;
  referer?: string;
  debug?: boolean;
  target?: '_blank' | '_parent' | '_top' | '_self';
  onClick?: (e: React.MouseEvent) => void;
}

export const IfmLink = (props: IfmLinkProps) => {
  const { path, children, referer, onClick, to, target, replace, debug, ...rest } = props;
  const ifm = useIfm()!.ifm;
  const isMate = ifm.role !== 'standalone';
  const [ori, setOri] = useState<string>();
  const ifmStr = ifm.encode({
    command: 'navigate',
    payload: {
      path: to,
      referer,
      options: {
        replace: true
      }
    }
  });

  const ifmPath = typeof to !== 'undefined' ? `${path}?ifm=${ifmStr}` : path;

  const handleClick = (e) => {
    if (!target) {
      if (isMate) e.preventDefault();
      void ifm.post({
        command: 'navigate',
        payload: {
          path: ifmPath,
          options: { replace }
        }
      });
    }
    onClick && onClick(e);
  };

  useEffect(() => {
    if (ifm.role !== 'child') return setOri(window.location.origin);
    ifm.post({ command: 'url' }).then((res) => {
      const uri = new URL(res);
      setOri(uri.origin);
    });
  }, []);

  const targetUrl = ifmPath.includes('://') ? ifmPath : `${ori}${ifmPath}`;

  return !debug ? (
    <a href={targetUrl} target={target} {...rest} onClick={handleClick}>
      {children}
    </a>
  ) : (
    <Link to={to || '/'} {...rest} onClick={handleClick}>
      {children}
    </Link>
  );
};
