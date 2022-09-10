import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Home } from './pages/home';
import { About } from './pages/about';
import { IframeApp } from './components/iframe-app';
import { useEffect } from 'react';
import IframeMate from '@jswork/iframe-mate';
import commands from './commands';

const ifmate = new IframeMate({ routerType: 'browser', debug: true });

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('init site1');
    ifmate.init(commands, { navigate });
  }, []);

  return (
    <div className="App">
      <header>
        <button
          onClick={(e) => {
            console.log('click?');
            ifmate.post({ command: 'updateRandom' }).then((res) => {
              console.log('res::', res);
            });
          }}>
          updateChildRandom
        </button>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <IframeApp src="http://localhost:5002/" />
    </div>
  );
}

export default App;
