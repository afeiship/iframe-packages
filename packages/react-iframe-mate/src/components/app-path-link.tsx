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
  routerType?: 'hash' | 'browser';
  onClick?: (e: React.MouseEvent) => void;
};

function AppPathLink(inProps: Props) {
  const { path, subpath, to, children, replace, routerType, onClick } = inProps;
  const { ifm } = useIfm()!;
  const [ori, setOri] = useState<string>();
  const [clicked, setClicked] = useState(false);
  const [targetURL, setTargetURL] = useState<string>();
  const _routerType = routerType || ifm.options.routerType;
  const sep = _routerType === 'hash' ? '#' : '';
  const appPathStr = encodeURIComponent(encodeURIComponent(`${subpath}${sep}${to}`));
  const navigate = useNavigate();
  const isReplace = replace === true || typeof replace === 'undefined';

  const handleClick = (inEvent: any) => {
    inEvent.preventDefault();
    setClicked(true);
    onClick && onClick(inEvent);
  };

  useEffect(() => {
    if (ifm.role !== 'child') return setOri(window.location.origin);
    ifm.post({ command: 'url' }).then((res) => {
      const uri = new URL(res);
      setOri(uri.origin);
    });
  }, [ifm]);

  useEffect(() => {
    setTargetURL(`${ori}${path}?app-path=${appPathStr}`);
  }, [ori, path, appPathStr]);

  if (!targetURL) return null;
  if (clicked) return navigate(to, { replace: isReplace }), null;

  return (
    <a href={targetURL} onClick={handleClick}>
      {children}
    </a>
  );
}

AppPathLink.defaultProps = {
  subpath: '',
  routerType: 'hash'
};

export default AppPathLink;
