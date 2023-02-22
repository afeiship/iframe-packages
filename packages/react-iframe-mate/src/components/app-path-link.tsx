import { useIfm } from '@jswork/react-iframe-mate';
import React, { useEffect, useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';

// https://cloud.beta.aigene.org.cn/main/projects/15/jobs/1073
// ?app-path=/protein-solubizing-frontend/beta/index.html
// #/datasets/1073/report/3476?showId=1073_62470

type Props = {
  path: string;
  subpath?: string;
  to: string;
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
};

export const AppPathLink = (inProps: Props) => {
  const { path, subpath, to, children, onClick } = inProps;
  const { ifm } = useIfm()!;
  const [ori, setOri] = useState<string>();
  const [clicked, setClicked] = useState(false);
  const [targetURL, setTargetURL] = useState<string>('');
  const appPathStr = encodeURIComponent(encodeURIComponent((`${subpath}#${to}`)));

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
  if (clicked) return <Link to={to}>{children}</Link>;

  return (
    <a href={targetURL} onClick={handleClick}>
      {children}
    </a>
  );
};
