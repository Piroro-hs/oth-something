const {spawn} = require('child_process');
const {join} = require('path');

const {app, BrowserWindow} = require('electron');

const {accessSync: access, copySync: copy, writeFileSync: writeFile} = require('fs-extra');

// const {default: installExtension, REDUX_DEVTOOLS} = require('electron-devtools-installer');
//
// installExtension(REDUX_DEVTOOLS);

const CONFIG_PATH = join(app.getPath('userData'), 'oth-config');

try {
  access(CONFIG_PATH);
} catch (e) {
  copy(join(app.getAppPath(), 'app', 'config'), CONFIG_PATH);
}

const code = `('global', eval)('this').CONFIG_PATH = '${CONFIG_PATH.replace(/\\/g, '\\\\')}';`;
writeFile(join(app.getAppPath(), 'app', 'config.js'), code);

if (process.argv[2] === 'cui') {
  cui();
} else {
  gui();
}

function cui() {
  spawn(
    'node',
    [join(app.getAppPath(), 'app', 'cui', 'index.js'), CONFIG_PATH],
    {shell: true, detached: true}
  );
}

function gui() {
  let win; // eslint-disable-line fp/no-let
  const createWindow = function createWindow() {
    win = new BrowserWindow({width: 800, height: 600}); // eslint-disable-line fp/no-mutation
    win.loadURL(`${
      process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : `file://${__dirname}`
    }/gui/index.html`);
    win.webContents.openDevTools();
    win.on('closed', () => {
      win = null; // eslint-disable-line fp/no-mutation
    });
  };
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
}
