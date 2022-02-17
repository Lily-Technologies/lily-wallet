import React, { createContext, useState } from 'react';

export const SidebarContext = createContext({
  setSidebarOpen: (val: boolean) => {},
  sidebarOpen: false
});

export const SidebarProvider = ({ children }: { children: React.ReactChild }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const value = {
    setSidebarOpen,
    sidebarOpen
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};
