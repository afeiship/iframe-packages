import React, { useEffect, useState } from 'react';
import { Link, LinkProps, useNavigate } from 'react-router-dom';
import { useIfm } from '.';

export interface IfmLinkProps extends Omit<LinkProps, 'to'> {
  path: string;
  to?: string;
  children: React.ReactNode;
  referer?: string;
  standalone?: boolean;
  disabled?: boolean;
  target?: '_blank' | '_parent' | '_top' | '_self';
  onClick?: (e: React.MouseEvent) => void;
}

function IfmLink(props: IfmLinkProps) {
  const { path, children, referer, onClick, to, target, replace, standalone, disabled, ...rest } =
    props;
  const { ifm } = useIfm()!;
  const isMainFrame = ifm.role !== 'child';
  const [ori, setOri] = useState<string>();
  const [targetURL, setTargetURL] = useState<string>();
  const navigate = useNavigate();
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

  const handleClick = (e): any => {
    const isHotKey = e.ctrlKey || e.metaKey || e.shiftKey;
    if (disabled) return e.preventDefault();
    if (!target && !isHotKey) {
      if (!standalone) e.preventDefault();
      if (isMainFrame) return navigate(ifmPath, { replace });
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

  // set origin
  useEffect(() => {
    if (isMainFrame) return setOri(window.location.origin);
    ifm.post({ command: 'url' }).then((res) => {
      const uri = new URL(res);
      setOri(uri.origin);
    });
  }, []);

  // set target url
  useEffect(() => {
    if (disabled) return setTargetURL(undefined);
    setTargetURL(ifmPath.includes('://') ? ifmPath : `${ori}${ifmPath}`);
  }, [ori, ifmPath, disabled]);

  if (standalone)
    return <Link to={to || '/'} {...rest} onClick={handleClick} children={children} />;

  return (
    <a
      data-disabled={disabled}
      aria-disabled={disabled}
      href={targetURL}
      target={target}
      {...rest}
      onClick={handleClick}>
      {children}
    </a>
  );
}

IfmLink.defaultProps = {
  disabled: false
};

export default IfmLink;
