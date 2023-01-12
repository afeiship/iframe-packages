import './App.css';
import styled from 'styled-components';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Qa1 } from './pages/qa1';
import { Qa2 } from './pages/qa2';
import { Qa3 } from './pages/qa3';
import { Qa4 } from './pages/qa4';
import { useIfm } from '@jswork/react-iframe-mate';
import { useEffect, useState } from 'react';
import { IfmLink } from '@jswork/react-iframe-mate';

// import IfmLink from './components/ifm-link';

const NavContainer = styled.nav`
  text-align: center;

  a {
    margin-right: 10px;
  }

  button {
    margin: 10px auto;
  }
`;

function App() {
  // ifmNavigate
  // IfmLink
  const navigate = useNavigate();
  const { ifm } = useIfm({ navigate });

  useEffect(() => {
    console.log('did mount.');
  }, []);

  return (
    <div className="App">
      <h1>
        <center>Site2</center>
      </h1>
      <NavContainer>
        <IfmLink target="_blank" path="/site2" to="/">
          Qa1-openBlank
        </IfmLink>
        <IfmLink path="/site2" to="/qa2">
          Qa2
        </IfmLink>
        <IfmLink path="/site3" to="/">
          Site3
        </IfmLink>
        <button
          onClick={(e) => {
            ifm.navigate({
              path: '/site2',
              to: '/qa4',
              target: '_blank',
            });
          }}>
          toQa4 - navigate api
        </button>
      </NavContainer>
      <Routes>
        <Route path="/" element={<Qa1 />} />
        <Route path="/qa2" element={<Qa2 />} />
        <Route path="/qa3" element={<Qa3 />} />
        <Route path="/qa4" element={<Qa4 />} />
      </Routes>
    </div>
  );
}

export default App;
