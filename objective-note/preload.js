const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getJobs: () => ipcRenderer.invoke('get-jobs'),
  saveJobs: (jobs) => ipcRenderer.invoke('save-jobs', jobs),
  selectResumeFolder: () => ipcRenderer.invoke('select-resume-folder'),
  getResumes: () => ipcRenderer.invoke('get-resumes'),
  saveResumes: (data) => ipcRenderer.invoke('save-resumes', data),
  validateFolderAccess: (folderPath) => ipcRenderer.invoke('validate-folder-access', folderPath),
  scanFolderForResumes: (folderPath) => ipcRenderer.invoke('scan-folder-for-resumes', folderPath),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  selectFile: (options) => ipcRenderer.invoke('select-file', options),
  checkFileExists: (filePath) => ipcRenderer.invoke('check-file-exists', filePath),
  copyFileToFolder: (sourceFilePath, targetFolder) => ipcRenderer.invoke('copy-file-to-folder', { sourceFilePath, targetFolder }),
}) 