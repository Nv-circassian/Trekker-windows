const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path'), fs = require('fs');
if (!app.requestSingleInstanceLock()) app.quit();
const cfgFile = () => path.join(app.getPath('userData'), 'autosave.json');
const readCfg = () => { try { return JSON.parse(fs.readFileSync(cfgFile(), 'utf8')); } catch (e) { return {}; } };
const target = () => readCfg().path || path.join(app.getPath('documents'), 'Трекер', 'trekker-backup.json');
let win = null;
function createWindow() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({ icon: path.join(__dirname, 'build', 'icon.png'), width: 1100, height: 800, minWidth: 380, minHeight: 600, backgroundColor: '#EEF1F5', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false } });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}
ipcMain.handle('pick', async () => {
  const r = await dialog.showSaveDialog(win, { title: 'Файл автосохранения', defaultPath: target(), filters: [{ name: 'Копия Трекера', extensions: ['json'] }] });
  if (r.canceled || !r.filePath) return {};
  fs.writeFileSync(cfgFile(), JSON.stringify({ path: r.filePath }));
  return { path: r.filePath };
});
ipcMain.handle('write', async (e, json) => {
  try {
    const p = target();
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p + '.tmp', json);
    fs.renameSync(p + '.tmp', p);
    return { ok: true, path: p };
  } catch (err) { return { ok: false, err: String(err.message || err) }; }
});
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
