// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const MusicStore = require('./render/MyStore');
const myStore = new MusicStore({"name": "General Hao music"});

console.log(app.getPath('userData'));

class MusicWindow extends BrowserWindow {
  constructor(config, filePath) {
    const baseConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    }
    const finalConfig = {...baseConfig, ...config};
    super(finalConfig);
    this.loadFile(filePath);
    this.once('ready-to-show', () => {
      this.show();
    })
  }
}

app.on('ready', () => {
  const mainWindow = new MusicWindow({}, "./render/index.html");
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.send("add-music-list-index", myStore.getTracks());
  });
  let addWindow;

  ipcMain.on("addButtonClicked", () => {
   addWindow = new MusicWindow({width: 600, height: 600}, "./render/add.html");
  })

  ipcMain.on("chooseMusic", (event) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'], 
      filters: [{ 
        name: 'Music', extensions: ['mp3']
      }]
    }, (filePaths) => {
      event.sender.send("add-music-list", filePaths);
    })
  })

  ipcMain.on("addMusic", (event, tracks) => {
    const currentTracks = myStore.addTracks(tracks).getTracks();
    console.log(currentTracks);
    mainWindow.send("add-music-list-index", currentTracks);
    addWindow.close()
  })

  ipcMain.on("delete-current-track", (event, id) => {
    const currentTracks = myStore.removeTrack(id).getTracks();
    mainWindow.send("add-music-list-index", currentTracks);
  })
});