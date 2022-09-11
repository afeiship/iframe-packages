import './App.css';
import { UptRandom } from './components/upt-random';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Qa1 } from './pages/qa1';
import { Qa2 } from './pages/qa2';
import { useIfm } from '@jswork/react-iframe-mate';
import { ATab } from './components/a-tab';
import { useEffect, useState } from 'react';

function App() {
  const navigate = useNavigate();
  const [tabKey, setTabKey] = useState('k1');
  const { ifm } = useIfm({ navigate, setTabKey });

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

      <Routes>
        <Route path="/qa1" element={<Qa1 />} />
        <Route path="/qa2" element={<Qa2 />} />
      </Routes>
    </div>
  );
}

export default App;
