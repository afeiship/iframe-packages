import './App.css';
import { UptRandom } from './components/upt-random';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { Qa1 } from './pages/qa1';
import { Qa2 } from './pages/qa2';
import { Qa3 } from './pages/qa3';
import { Qa4 } from './pages/qa4';
import { useIfm } from '@jswork/react-iframe-mate';
import { ATab } from './components/a-tab';
import { useEffect, useState } from 'react';

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
      <button
        onClick={(e) => {
          ifm.post({
            command: 'navigate',
            payload: {
              path: '/about?a=1&b=2',
            },
          });
        }}>
        子调父: change parent page
      </button>

      <button
        onClick={(e) => {
          const msg = {
            command: 'navigate',
            payload: {
              delta: -1,
            },
          };
          ifm.post(msg);
        }}>
        子调父:Back
      </button>

      <UptRandom />
      <ATab tabKey={tabKey} />

      <button
        onClick={(e) => {
          console.log('set ifm');
        }}>
        Set IFM
      </button>

      <hr />
      <button
        onClick={(e) => {
          ifm.navigate({ pathname: '/qa', subpath: '/qa1' });
        }}>
        To Qa1 - push
      </button>
      <button
        onClick={(e) => {
          ifm.navigate({ pathname: '/qa', subpath: '/qa2' });
        }}>
        To Qa2 - replace
      </button>
      <button
        onClick={(e) => {
          ifm.navigate({ pathname: '/qa', subpath: '/qa4' });
        }}>
        To Q4
      </button>

      <h4>
        <center>Self/parent are the same</center>
      </h4>
      <nav>
        <button onClick={(e) => navigate(-1)}>Self Back()</button>
        <button onClick={(e) => navigate(1)}>Self Forward()</button>
      </nav>

      <nav>
        <button onClick={(e) => ifm.emit({ command: 'back' })}>Parent Back()</button>
        <button onClick={(e) => ifm.emit({ command: 'forward' })}>Parent Forward()</button>
      </nav>

      <Routes>
        <Route path="/qa1" element={<Qa1 />} />
        <Route path="/qa2" element={<Qa2 />} />
        <Route path="/qa3" element={<Qa3 />} />
        <Route path="/qa4" element={<Qa4 />} />
      </Routes>
    </div>
  );
}

export default App;
