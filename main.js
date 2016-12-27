const {app, BrowserWindow, Menu, MenuItem} = require('electron');
const path = require('path');
const url = require('url');

const appName = "drawr"

let win = null;
let serverProc = null;

// open the application window and load the index.html from the ASAR
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/basic/index.html'),
    protocol: 'file',
    slashes: true
  }));

  win.on('closed', () => {
    win = null;
  });
}

// spawn a async subprocess with the server
function startServer(serverPort) {
  const execFile = require('child_process').execFile;
  serverProc = execFile(path.join(__dirname, 'dist/server/drawr-server'), [ '-p', serverPort ], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }

    console.log(stdout);
    console.log(stderr);
  });

  console.log('drawr-server started.')
}

// stop the server process by sending SIGHUP
function stopServer() {
  console.log('stopping drawr-server...', serverProc.pid);
  if (serverProc.pid !== null) {
    serverProc.kill('SIGHUP');
  }
  console.log('drawr-server stopped.')
}

// drawr is a single window application
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

  // do macOS specific stuff
  if (process.platform === 'darwin') {
    // app.dock.setIcon(appIcon)
    // app.dock.setMenu(menu)
  }

  createWindow();

  const menuTempl = [
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Server', 
    submenu: [
      new MenuItem({
        label: 'Start',
        click() { startServer(8080) }
      }),
      new MenuItem({
        label: 'Stop',
        click() { stopServer() }
      }),
    ],
  }]
  // create the macOS specific menu layout
  if (process.platform === 'darwin' ) {
    menuTempl.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTempl));
});

app.on('window-all-closed', () => {
  // we don't want that on macOS
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('quit', () => {
  // stopServer();
})
