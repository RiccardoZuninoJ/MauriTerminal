// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const pty = require('node-pty')
const os = require('os');

var shell = os.platform() === "win32" ? 'cmd.exe' : "bash";
var mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  var ptyP = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    cwd: process.env.HOME,
    env: process.env
  });

    ptyP.on('data', data => {
        mainWindow.webContents.send("terminal.input", data);
    });

    ipcMain.on("terminal.keystroke", (event, key) => {
        ptyP.write(key);
    });
    
    /*ipcMain.on("resize", (event, resize) => {
        ptyP.resize(resize[0], resize[1]);
    });*/
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("type", shell);
  });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
    
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
