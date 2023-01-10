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
    console.log('rootRef.current:', rootRef.current);
    rootRef.current.contentWindow.location.replace(props.src);
  }, [props.src]);
  return <Container ref={rootRef} onLoad={props.onLoad} />;
};
