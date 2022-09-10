import './App.css';
import { useEffect, useState } from 'react';
import commands from './commands';
import { UptRandom } from './components/upt-random';
import IframeMate from '@jswork/iframe-mate';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Qa1 } from './pages/qa1';
import { Qa2 } from './pages/qa2';

const ifmate = new IframeMate();

window.ifmate = ifmate;

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    ifmate.init(commands, { navigate });
    console.log('site 2 mounted.');
  }, []);

  return (
    <div className="App">
      <button
        onClick={(e) => {
          ifmate.post({
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
          const ift = {
            command: 'navigate',
            payload: {
              delta: -1,
            },
          };
          ifmate.post(ift);
        }}>
        子调父:Back
      </button>

      <UptRandom />

      <Routes>
        <Route path="/qa1" element={<Qa1 />} />
        <Route path="/qa2" element={<Qa2 />} />
      </Routes>
    </div>
  );
}

export default App;
