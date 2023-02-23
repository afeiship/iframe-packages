import React, { useEffect, useState } from 'react';
import { Link, LinkProps, useNavigate } from 'react-router-dom';
import { useIfm } from '.';

export interface IfmLinkProps extends Omit<LinkProps, 'to'> {
  path: string;
  to?: string;
  children: React.ReactNode;
  referer?: string;
  standalone?: boolean;
  target?: '_blank' | '_parent' | '_top' | '_self';
  onClick?: (e: React.MouseEvent) => void;
}

export const IfmLink = (props: IfmLinkProps) => {
  const { path, children, referer, onClick, to, target, replace, standalone, ...rest } = props;
  const navigate = useNavigate();
  const { ifm } = useIfm()!;
  const isMainFrame = ifm.role !== 'child';
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
      if (!standalone) e.preventDefault();
      if (isMainFrame) {
        navigate(ifmPath, { replace });
      } else {
        void ifm.post({
          command: 'navigate',
          payload: {
            path: ifmPath,
            options: { replace }
          }
        });
      }
    }
    onClick && onClick(e);
  };

  useEffect(() => {
    if (isMainFrame) return setOri(window.location.origin);
    ifm.post({ command: 'url' }).then((res) => {
      const uri = new URL(res);
      setOri(uri.origin);
    });
  }, []);

  const targetURL = ifmPath.includes('://') ? ifmPath : `${ori}${ifmPath}`;

  return !standalone ? (
    <a href={targetURL} target={target} {...rest} onClick={handleClick}>
      {children}
    </a>
  ) : (
    <Link to={to || '/'} {...rest} onClick={handleClick}>
      {children}
    </Link>
  );
};
