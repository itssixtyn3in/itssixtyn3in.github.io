const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  mainWindow.loadFile('index.html');

  const filePath = 'C:\\Windows\\win.ini'; // Define the file path

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      // Handle error when file reading fails
    } else {
      // Send file content to the renderer process
      mainWindow.webContents.send('file-content', data);
    }
  });
});

// Listen for renderer process requests for the file content
ipcMain.on('get-file-content', (event) => {
  // You can add more logic here if needed
  // For example, re-read the file content or process it further
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      // Handle error when file reading fails
    } else {
      // Send file content to the renderer process
      event.reply('file-content', data);
    }
  });
});
