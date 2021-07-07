const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", {
  invoke: (command, args) => ipcRenderer.invoke(command, args),
  send: (command, args) => ipcRenderer.send(command, args),
  on: (command, args) => ipcRenderer.on(command, args),
});
