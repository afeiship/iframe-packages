import App from '../App';
import { HashRouter } from 'react-router-dom';
import React from 'react';
import ReactIframeMate from '@jswork/react-iframe-mate';
import commands from '../commands';

export const AppProvider = () => {
  return (
    <HashRouter>
      <ReactIframeMate commands={commands} routerType="hash" isCorsDomain debug>
        <App />
      </ReactIframeMate>
    </HashRouter>
  );
};
