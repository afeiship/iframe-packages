import './App.css';
import { useEffect, useState } from 'react';
import iftTools from 'ift-tools';

function App() {
  const [v, setV] = useState();
  useEffect(() => {
    // window.document.domain = 'dev.com'
  }, []);

  useEffect(() => {
    window.addEventListener('message', (e) => {
      if (e.data.command === 'updateRandom') {
        setV('from parent: ' + Math.random());
      }
    });
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

      <button
        onClick={(e) => {
          setV(Math.random());
        }}>
        Set random state - {v}
      </button>
    </div>
  );
}

export default App;
