import App from './App';
import { HashRouter } from 'react-router-dom';
import React from 'react';
import ReactIframeMate from '@jswork/react-iframe-mate';
import commandRepo from './commands';

export const AppProvider = () => {
  return (
    <HashRouter>
      <ReactIframeMate commands={commandRepo} routerType="hash" isCorsDomain debug>
        <App />
      </ReactIframeMate>
    </HashRouter>
  );
};
