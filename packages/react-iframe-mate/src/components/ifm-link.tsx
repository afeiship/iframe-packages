import React from 'react';
import { Link } from 'react-router-dom';
import { useIfm } from '.';

export interface IfmLinkProps {
  path: string;
  sub: string;
  referer: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export const IfmLink = (props: IfmLinkProps) => {
  const { path, sub, children, referer, onClick, ...rest } = props;
  const ifm = useIfm()!.ifm;
  const isMate = ifm.role !== 'standalone';

  const handleClick = (e: React.MouseEvent) => {
    ifm.navigate({
      path,
      sub,
      referer,
      replace: false
    });
    onClick && onClick(e);
  };

  return (
    <Link to={sub} replace={isMate} {...rest} onClick={handleClick}>
      {children}
    </Link>
  );
};
