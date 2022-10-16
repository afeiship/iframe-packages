import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { useIfm } from '.';

export interface IfmLinkProps extends LinkProps {
  path: string;
  to: string;
  referer: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export const IfmLink = (props: IfmLinkProps) => {
  const { path, children, referer, onClick, to, ...rest } = props;
  const ifm = useIfm()!.ifm;
  const isMate = ifm.role !== 'standalone';

  const handleClick = (e: React.MouseEvent) => {
    ifm.navigate({
      path,
      sub: to,
      referer,
      replace: false
    });
    onClick && onClick(e);
  };

  return (
    <Link to={to} replace={isMate} {...rest} onClick={handleClick}>
      {children}
    </Link>
  );
};
