import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Home } from './pages/home';
import { About } from './pages/about';
import { IframeApp } from './components/iframe-app';
import { useIfm, useNavigation } from '@jswork/react-iframe-mate';
import { useState } from 'react';

function App() {
  const navigate = useNavigate();
  const navi = useNavigation();
  const { ifm } = useIfm({ navigate });
  console.log('navi:', navi);

  return (
    <div className="App" data-pathname={navi.pathname}>
      <header>
        <button
          onClick={(e) => {
            ifm.post({ command: 'updateRandom' }).then((res) => {
              console.log('res::', res);
            });
          }}>
          updateChildRandom
        </button>
        <button
          onClick={(e) =>
            ifm.post({
              persist: true,
              command: 'tabKey',
              payload: 'k2',
            })
          }>
          SET IFM: tabKey
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
