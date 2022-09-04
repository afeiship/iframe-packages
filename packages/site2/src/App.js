import './App.css';
import { useEffect, useState } from 'react';
import iftTools from 'ift-tools';
import commands from './commands';
import { UptRandom } from './components/upt-random';

function App() {
  useEffect(() => {
    iftTools.init(commands);
  }, []);

  return (
    <div className="App">
      <button
        onClick={(e) => {
          iftTools.post({
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
          window.top.postMessage(ift, '*');
        }}>
        子调父:Back
      </button>

      <UptRandom />
    </div>
  );
}

export default App;
