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
  const navigate = useNavigate();
  const [tabKey, setTabKey] = useState('k1');
  const { ifm } = useIfm({ navigate, setTabKey });
  const navx = (to) => {
    navigate(to, { replace: true });
    ifm.post({
      as: 'ifm',
      command: 'navigate',
      payload: { path: to },
    });
  };

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
              url: '/about?a=1&b=2',
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
          navigate('/qa1');
        }}>
        To Qa1 - push
      </button>
      <button
        onClick={(e) => {
          navigate('/qa2', { replace: true });
        }}>
        To Qa2 - replace
      </button>
      <Link replace className="button" to="/qa3">
        To Qa3
      </Link>

      <button
        onClick={(e) => {
          console.log('navx!');
          navx('/qa4');
        }}>
        Use Navx
      </button>

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
