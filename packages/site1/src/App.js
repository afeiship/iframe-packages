import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Home } from './pages/home';
import { About } from './pages/about';
import { IframeApp } from './components/iframe-app';
import { useIfm } from '@jswork/react-iframe-mate';

function App() {
  const navigate = useNavigate();
  const { ifm } = useIfm({ navigate });

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
