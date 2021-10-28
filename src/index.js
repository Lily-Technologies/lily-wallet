import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { AccountMapProvider } from './context/AccountMapContext';
import { ConfigProvider } from './context/ConfigContext';
import { ModalProvider } from './context/ModalContext';
import { PlatformProvider } from './context/PlatformContext';

ReactDOM.render(
  <PlatformProvider>
    <ConfigProvider>
      <AccountMapProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </AccountMapProvider>
    </ConfigProvider>
  </PlatformProvider>,
  document.getElementById('root')
);
