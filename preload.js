const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('trekkerDesktop', {
  pick: () => ipcRenderer.invoke('pick'),
  write: json => ipcRenderer.invoke('write', json)
});
