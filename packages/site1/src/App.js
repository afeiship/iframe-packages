import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Home } from './pages/home';
import { About } from './pages/about';
import { IframeApp } from './components/iframe-app';
import { useEffect } from 'react';
import iftTool from 'ift-tools';
import commands from './commands';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    iftTool.init(commands, { navigate });
  }, []);

  return (
    <div className="App">
      <header>
        <button
          onClick={(e) => {
            iftTool.post({ command: 'updateRandom' });
          }}>
          updateChildRandom
        </button>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <IframeApp src="http://s2.dev.com:5002/" />
    </div>
  );
}

export default App;
