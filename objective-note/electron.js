const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'public/icon.png'), // You can add an icon later
    titleBarStyle: 'default',
    show: false, // Don't show until ready
  });

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    // Load from Next.js dev server
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // Load the built Next.js app
    mainWindow.loadFile(path.join(__dirname, 'out/index.html'));
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});

// IPC handlers for job data persistence
ipcMain.handle('get-jobs', async () => {
  try {
    const dataPath = path.join(app.getPath('userData'), 'jobs.json');
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading jobs:', error);
    return [];
  }
});

ipcMain.handle('save-jobs', async (event, jobs) => {
  try {
    const dataPath = path.join(app.getPath('userData'), 'jobs.json');
    fs.writeFileSync(dataPath, JSON.stringify(jobs, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving jobs:', error);
    return { success: false, error: error.message };
  }
});

// Resume management IPC handlers
ipcMain.handle('select-resume-folder', async () => {
  try {
    const { dialog } = require('electron');
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Resume Folder'
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      return { success: true, folderPath: result.filePaths[0] };
    }
    return { success: false, error: 'No folder selected' };
  } catch (error) {
    console.error('Error selecting folder:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-resumes', async () => {
  try {
    const dataPath = path.join(app.getPath('userData'), 'resumes.json');
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data);
    }
    return { resumes: [], tags: [], selectedFolder: null };
  } catch (error) {
    console.error('Error reading resumes:', error);
    return { resumes: [], tags: [], selectedFolder: null };
  }
});

ipcMain.handle('scan-folder-for-resumes', async (event, folderPath) => {
  try {
    const supportedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const files = [];
    
    if (fs.existsSync(folderPath)) {
      const items = fs.readdirSync(folderPath);
      
      for (const item of items) {
        const itemPath = path.join(folderPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isFile()) {
          const ext = path.extname(item).toLowerCase();
          if (supportedExtensions.includes(ext)) {
            const fileName = path.basename(item, ext);
            const fileType = ext.substring(1); // Remove the dot
            
            files.push({
              fileName: item,
              displayName: fileName.replace(/_/g, ' '),
              filePath: itemPath,
              fileType: fileType,
              size: stats.size,
              modifiedDate: stats.mtime.toISOString()
            });
          }
        }
      }
    }
    
    return { success: true, files };
  } catch (error) {
    console.error('Error scanning folder:', error);
    return { success: false, error: error.message, files: [] };
  }
});

ipcMain.handle('save-resumes', async (event, data) => {
  try {
    const dataPath = path.join(app.getPath('userData'), 'resumes.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving resumes:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('validate-folder-access', async (event, folderPath) => {
  try {
    if (fs.existsSync(folderPath)) {
      // Try to read the directory to ensure we have access
      fs.readdirSync(folderPath);
      return { success: true };
    }
    return { success: false, error: 'Folder not found' };
  } catch (error) {
    console.error('Error validating folder access:', error);
    return { success: false, error: error.message };
  }
});

// Open file in default application
ipcMain.handle('open-file', async (event, filePath) => {
  try {
    const { shell } = require('electron');
    
    if (fs.existsSync(filePath)) {
      await shell.openPath(filePath);
      return { success: true };
    } else {
      return { success: false, error: 'File not found' };
    }
  } catch (error) {
    console.error('Error opening file:', error);
    return { success: false, error: error.message };
  }
}); 