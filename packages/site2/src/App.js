import './App.css';
import { useEffect, useState } from 'react';
import commands from './commands';
import { UptRandom } from './components/upt-random';
import IframeMate from 'iframe-mate';

const ifmate = new IframeMate();

window.ifmate = ifmate;

function App() {
  useEffect(() => {
    ifmate.init(commands);
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
    </div>
  );
}

export default App;
