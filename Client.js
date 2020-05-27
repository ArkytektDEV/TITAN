const { app, BrowserWindow, ipcMain } = require('electron')
let win;

const { autoUpdater } = require('electron-updater');

function createWindow () {
  win = new BrowserWindow({
    width: 350,
    height: 500,
    frame: false,
    icon: "APPLICATION/IMAGES/icon.ico",
    webPreferences: {
      nodeIntegration: true
    }
  })

//DO NOT TOUCH THIS LINE RIGHT HERE 
  win.loadFile('APPLICATION/HTML/load.html')
//THIS ONE DONT TOUCH IT ^^^^^^^^^

  win.on('closed', () => {
    win = null
  })

    autoUpdater.checkForUpdatesAndNotify();
}



app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

autoUpdater.on('checking-for-update', () => {
  win.webContents.send('checking_for_update');
});

autoUpdater.on('update-available', () => {
  win.webContents.send('update_available');
});

autoUpdater.on('update-not-available', () => {
  win.webContents.send('update_not_available');
});

autoUpdater.on('update-downloaded', () => {
  win.webContents.send('update_downloaded');
});



autoUpdater.on('download-progress', (progressObj) => {
  let log_message = ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  win.webContents.send('download_progress', log_message);
})



ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});