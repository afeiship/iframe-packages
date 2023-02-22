import { useIfm } from '.';
import React, { useEffect, useState, ReactNode } from 'react';

type Props = {
  path: string;
  to: string;
  referer?: string;
  children: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
};

export const AppPathLink = (inProps: Props) => {
  const { path, to, children, onClick } = inProps;
  const { ifm } = useIfm()!;
  const [targetURL, setTargetURL] = useState<string>('');

  const handleClick = (inEvent: any) => {
    inEvent.preventDefault();
    void ifm.post({
      command: 'navigate',
      payload: {
        path: to,
        replace: true
      }
    });
    onClick && onClick(inEvent);
  };

  useEffect(() => {
    ifm.post({ command: 'url' }).then((url) => {
      const uri = new URL(url);
      const appPath = `app-path=${path}#${to}`;
      const tURL = `${uri.origin}${uri.pathname}?app-path=${encodeURIComponent(appPath)}`;
      setTargetURL(tURL);
    });
  }, []);

  if (!targetURL) return null;
  return (
    <a href={targetURL} onClick={handleClick}>
      {children}
    </a>
  );
};
