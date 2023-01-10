import './App.css';
import { UptRandom } from './components/upt-random';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Qa1 } from './pages/qa1';
import { Qa2 } from './pages/qa2';
import { Qa3 } from './pages/qa3';
import { Qa4 } from './pages/qa4';
import { useIfm } from '@jswork/react-iframe-mate';
import { useEffect, useState } from 'react';
import IfmLink from './components/ifm-link';

function App() {
  // ifmNavigate
  // IfmLink
  const navigate = useNavigate();
  const [tabKey, setTabKey] = useState('k1');
  const { ifm } = useIfm({ navigate, setTabKey });

  useEffect(() => {
    console.log('did mount.');
  }, []);

  return (
    <div className="App">
      <h1>
        <center>Site2</center>
      </h1>
      <nav>
        <IfmLink path="/site2" to="/" referer="site2">
          Qa1
        </IfmLink>
        <IfmLink path="/site2" to="/qa2" referer="site2">
          Qa2
        </IfmLink>
        <IfmLink path="/site3" to="/" referer="site2">
          Site3
        </IfmLink>
      </nav>
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
