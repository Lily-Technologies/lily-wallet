import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { AccountMapProvider } from './context/AccountMapContext';
import { ConfigProvider } from './context/ConfigContext';
import { ModalProvider } from './context/ModalContext';
import { SidebarProvider } from './context/SidebarContext';
import { PlatformProvider } from './context/PlatformContext';
import { UnitProvider } from './context/UnitContext';

ReactDOM.render(
  <PlatformProvider>
    <ConfigProvider>
      <AccountMapProvider>
        <ModalProvider>
          <SidebarProvider>
            <UnitProvider>
              <App />
            </UnitProvider>
          </SidebarProvider>
        </ModalProvider>
      </AccountMapProvider>
    </ConfigProvider>
  </PlatformProvider>,
  document.getElementById('root')
);
