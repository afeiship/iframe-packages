import styled from 'styled-components';

const Container = styled.iframe`
  width: 80%;
  height: 80vh;
  margin: 0 auto;
`;

export const IframeApp = (props) => {
  return <Container src={props.src} onLoad={props.onLoad} />;
};
