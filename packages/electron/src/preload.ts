// @ts-nocheck
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipcRenderer', {
  invoke: (command, args) => ipcRenderer.invoke(command, args),
  send: (command, args) => ipcRenderer.send(command, args),
  on: (command, args) => ipcRenderer.on(command, args)
});
//# sourceMappingURL=preload.js.map
