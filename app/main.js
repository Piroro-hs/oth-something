const {app, BrowserWindow} = require('electron');
const {join} = require('path');
const {accessSync: access, copySync: copy} = require('fs-extra');

// const {default: installExtension, REDUX_DEVTOOLS} = require('electron-devtools-installer');
//
// installExtension(REDUX_DEVTOOLS);

try {
  access(join(app.getPath('userData'), 'oth-config'));
} catch (e) {
  copy(join(app.getAppPath(), 'app', 'config'), join(app.getPath('userData'), 'oth-config'));
}

let win; // eslint-disable-line fp/no-let

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600}); // eslint-disable-line fp/no-mutation
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:8080/index.html');
  } else {
    win.loadURL(`file://${__dirname}/index.html`);
  }
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null; // eslint-disable-line fp/no-mutation
  });
}

app.commandLine.appendSwitch('--enable-experimental-web-platform-features');

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
