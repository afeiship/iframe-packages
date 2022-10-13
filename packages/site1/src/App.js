import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Home } from './pages/home';
import { About } from './pages/about';
import { Qa } from './pages/qa';
import { IframeApp } from './components/iframe-app';
import { useIfm } from '@jswork/react-iframe-mate';
import { useState } from 'react';

function App() {
  const navigate = useNavigate();
  const [v, setV] = useState();
  const { ifm } = useIfm({ navigate });

  console.log('app1 site1');

  return (
    <div className="App">
      <header>
        <button
          onClick={(e) => {
            ifm.post({ command: 'updateRandom' }).then((res) => {
              console.log('res::', res);
            });
          }}>
          父调子: updateChildRandom
        </button>

        <button
          onClick={(e) => {
            ifm.post({ command: 'updateRandom', payload: 'FIXED_VALUE' }).then((res) => {
              console.log('res::', res);
            });
          }}>
          父调子: SET FIXED_VALUE
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
        <button
          onClick={(e) => {
            setV('ONLY_VALUE');
          }}>
          SetValue: {v}
        </button>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/qa" element={<Qa />} />
      </Routes>
      <IframeApp src="http://s2.dev.com:5002/" />
    </div>
  );
}

export default App;
