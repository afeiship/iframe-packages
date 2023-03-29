import styled from 'styled-components';
import { useEffect, useState, useRef } from 'react';

const Container = styled.iframe`
  width: 80%;
  height: 80vh;
  margin: 0 auto;
`;

export const IframeApp = (props) => {
  const rootRef = useRef(null);
  useEffect(() => {
    const iframeDom = rootRef.current;
    const targetWin = iframeDom.contentWindow;
    targetWin.location.replace(props.src);
  }, [props.src]);
  return <Container ref={rootRef} onLoad={props.onLoad} />;
};
