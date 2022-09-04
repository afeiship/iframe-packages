import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Home } from './pages/home';
import { About } from './pages/about';
import { IframeApp } from './components/iframe-app';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    window.addEventListener('message', (e) => {
      // 改变父级的 URL 并带 querystring
      if (e.data.command === 'navigate') {
        if (!e.data.payload.delta) {
          navigate(e.data.payload.path + '?' + e.data.payload.querystring);
        } else {
          navigate(e.data.payload.delta);
        }
      }
    });
  }, []);

  return (
    <div className="App">
      <header>
        <button
          onClick={(e) => {
            const el = document.querySelector('iframe');
            el.contentWindow.postMessage(
              {
                command: 'updateRandom',
              },
              '*'
            );
          }}>
          updateChildRandom
        </button>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <IframeApp
        onLoad={(e) => {
          // console.log('loading..');
          // window.document.domain = 'dev.com';
        }}
        src="http://s2.dev.com:5002/"
      />
    </div>
  );
}

export default App;
