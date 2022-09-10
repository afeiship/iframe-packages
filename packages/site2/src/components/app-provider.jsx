import App from '../App';
import { HashRouter, useNavigate } from 'react-router-dom';
import React from 'react';
import ReactIframeMate from '@jswork/react-iframe-mate';
import commands from '../commands';

export const AppProvider = () => {
  return (
    <HashRouter>
      <ReactIframeMate commands={commands} routerType="hash" debug={true}>
        <App />
      </ReactIframeMate>
    </HashRouter>
  );
};
