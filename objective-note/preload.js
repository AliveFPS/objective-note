const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getJobs: () => ipcRenderer.invoke('get-jobs'),
  saveJobs: (jobs) => ipcRenderer.invoke('save-jobs', jobs),
}) 