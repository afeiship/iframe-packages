import React, { useEffect, useState } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { useIfm } from '.';

export interface IfmLinkProps extends LinkProps {
  path: string;
  to: string;
  children: React.ReactNode;
  referer?: string;
  target?: '_blank' | '_parent' | '_top' | '_self';
  onClick?: (e: React.MouseEvent) => void;
}

export const IfmLink = (props: IfmLinkProps) => {
  const { path, children, referer, onClick, to, target, replace, ...rest } = props;
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

  const ifmPath = !!to ? `${path}?ifm=${ifmStr}` : path;

  const handleClick = (e) => {
    if (!target) {
      e.preventDefault();
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
    ifm.post({ command: 'url' }).then((res) => {
      const uri = new URL(res);
      setOri(uri.origin);
    });
  }, []);

  return isMate ? (
    <a href={`${ori}${ifmPath}`} target={target} {...rest} onClick={handleClick}>
      {children}
    </a>
  ) : (
    <Link to={to} {...rest} onClick={handleClick}>
      {children}
    </Link>
  );
};
