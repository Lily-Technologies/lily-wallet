import React, { createContext } from 'react';

import { BasePlatform, ElectronPlatform, WebPlatform } from 'src/frontend-middleware';

export const PlatformContext = createContext({
  platform: {} as BasePlatform
});

export const PlatformProvider = ({ children }: { children: React.ReactChild }) => {
  console.log('process.env: ', process.env);
  let platform: BasePlatform;
  if (process.env.REACT_APP_IS_ELECTRON) {
    platform = new ElectronPlatform();
  } else {
    platform = new WebPlatform();
  }

  const value = {
    platform
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
};
