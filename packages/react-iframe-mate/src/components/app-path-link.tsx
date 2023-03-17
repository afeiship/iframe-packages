import { useIfm } from '.';
import React, { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// https://cloud.beta.aigene.org.cn/main/projects/15/jobs/1073?app-path=/protein-solubizing-frontend/beta/index.html#/datasets/1073/report/3476?showId=1073_62470

type Props = {
  path: string;
  subpath?: string;
  to: string;
  children: ReactNode;
  replace?: boolean;
  disabled?: boolean;
  routerType?: 'hash' | 'browser';
  onClick?: (e: React.MouseEvent) => void;
};

function AppPathLink(inProps: Props) {
  const { path, subpath, to, children, replace, disabled, routerType, onClick } = inProps;
  const { ifm } = useIfm()!;
  const [ori, setOri] = useState<string>();
  const [targetURL, setTargetURL] = useState<string>();
  const _routerType = routerType || ifm.routerType;
  const sep = _routerType === 'hash' ? '#' : '';
  const appPathStr = encodeURIComponent(encodeURIComponent(`${subpath}${sep}${to}`));
  const navigate = useNavigate();
  const isReplace = replace === true || typeof replace === 'undefined';

  const handleClick = (e: any): any => {
    const isHotKey = e.ctrlKey || e.metaKey || e.shiftKey;
    if (disabled) return e.preventDefault();
    if (!isHotKey) {
      e.preventDefault();
      navigate(to, { replace: isReplace });
    }
    onClick && onClick(e);
  };

  useEffect(() => {
    if (ifm.role !== 'child') return setOri(window.location.origin);
    ifm.post({ command: 'url' }).then((res) => {
      const uri = new URL(res);
      setOri(uri.origin);
    });
  }, [ifm]);

  useEffect(() => {
    if (disabled) return setTargetURL(undefined);
    setTargetURL(`${ori}${path}?app-path=${appPathStr}`);
  }, [ori, path, appPathStr, disabled]);

  return (
    <a data-disabled={disabled} href={targetURL} onClick={handleClick}>
      {children}
    </a>
  );
}

AppPathLink.defaultProps = {
  subpath: '',
  routerType: 'hash',
  disabled: false
};

export default AppPathLink;
