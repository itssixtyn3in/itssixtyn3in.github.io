const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // Create a frameless window
    backgroundColor: '#ffffff',
    title: 'ElectroPwn',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      nodeIntegrationInSubFrames: false,
      preload: path.join(__dirname, 'preload.js'),
      nativeWindowOpen: true,
      enableRemoteModule: false,
      spellcheck: true
    },
  });


  mainWindow.loadFile('index.html');

  // Rest of your Electron app initialization
}

app.whenReady().then(createWindow);
