import './App.css';
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Home } from './pages/home';
import { About } from './pages/about';
import { Qa } from './pages/qa';
import { IframeApp } from './components/iframe-app';
import { IfmLink, useIfm } from '@jswork/react-iframe-mate';
import { useState } from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  margin: 10px auto;

  > * {
    margin-right: 10px;
  }
`;

const AppContainer = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style: none;

  li {
    min-height: 100px;
    background: #eee;
    align-items: center;
    width: 30%;
  }
`;

function App() {
  const navigate = useNavigate();
  const [v, setV] = useState();
  const { ifm } = useIfm({ navigate });
  const loc = useLocation();

  console.log('app1 site1', loc, loc.key);

  return (
    <div className="App">
      <NavContainer>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/site2">Site2</NavLink>
        <NavLink to="/site3">Site3</NavLink>
        <IfmLink path="/site2" to="/qa2">
          IFM-ToSite-q2
        </IfmLink>
      </NavContainer>
      <AppContainer>
        <li>App1</li>
        <li>App2</li>
        <li>App3</li>
      </AppContainer>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/site2" element={<IframeApp src="http://s2.dev.com:5002/" />} />
        <Route path="/site3" element={<IframeApp src="http://s3.dev.com:5003/" />} />
      </Routes>
    </div>
  );
}

export default App;
