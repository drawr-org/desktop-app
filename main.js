const {app, BrowserWindow, Tray} = require('electron');
const path = require('path');
const url = require('url');

const Drawr = require(path.join(__dirname, 'drawr.asar/lib/drawr-core.js'))

const appName = "drawr"
// const appIcon = new Tray('')

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'drawr.asar/basic/index.html'),
    protocol: 'file',
    slashes: true
  }));

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

// drawr is a single window application!
const shouldQuit = app.makeSingleInstance((commandLint, workingDir) => {
  // someone tried to run a second instance, focus our window
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

if (shouldQuit) {
  app.quit();
}

// create the rest of the app
app.on('ready', () => {
  app.setName(appName)

  if (process.platform === 'darwin') {
    // app.dock.setIcon(appIcon)
    // app.dock.setMenu(menu)
  }

  createWindow();
  // startCanvas();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
