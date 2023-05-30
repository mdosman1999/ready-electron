require('dotenv').config();
import { app, BrowserWindow, Tray, nativeImage, Menu, ipcMain, dialog } from 'electron';
import { join } from 'path';




let mainWindow;
let tray = null;


// Create the browser window.
// -----------------------------------------------
function createWindow() {
    if (!tray) { // if tray hasn't been created already.
        createTray();
    }

    mainWindow = new BrowserWindow({
        title: 'Domain Scraper',
        width: 440,
        height: 174,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true, // Open DevTools by default
        },
        show: false,
        resizable: false,
        icon: join(__dirname, './shield.ico')
    });

    // hide menu bar
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile(join(__dirname, 'index.html'));

    // Show the window when the app is ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    // Hide the window instead of quitting when the user closes it
    mainWindow.on('close', (event) => {
        event.preventDefault()
        mainWindow.hide()
    });


    // for hot reloading the randarar js
    if (process.env.NODE_ENV === 'development') {
        const electronConnect = require('electron-connect').client;
        electronConnect.create(mainWindow);
        mainWindow.webContents.openDevTools();
    }

}


// Create the tray 
// -----------------------------------------------
function createTray() {
    const icon = join(__dirname, './shield.ico') // required.
    const trayicon = nativeImage.createFromPath(icon)
    tray = new Tray(trayicon.resize({
        width: 16
    }))

    // toggle the window when clicking the tray icon.
    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide()
        } else {
            mainWindow.show()
        }
    })

    const contextMenu = Menu.buildFromTemplate([{
            label: 'Hide App',
            click: () => {
                mainWindow.hide()
            }
        },
        {
            label: 'Show App',
            click: () => {
                mainWindow.show()
            }
        },
        {
            label: 'Quit',
            click: () => {
                mainWindow.destroy();
                app.quit();
            }
        },
    ])

    tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
    createWindow();
});
app.on('window-all-closed', () => {
    app.quit(); // quit the app when all windows are closed.
});


// ipcMain
// -----------------------------------------------
// ipcMain.on('get-user-data-path', (event) => {
//    event.sender.send(app.getPath('userData'));
// });
ipcMain.handle('my-method', async (event, arg) => {
    // Do some asynchronous work here
    const result = app.getPath('userData');
    return result;
});


// consoleToRenderer
// -----------------------------------------------
function consoleToRenderer(message) {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach((win) => {
        win.webContents.send('message', message);
    });
}


// stop and start
// ----------------------------------------------- 
ipcMain.on('start-server', async() => {

});
ipcMain.on('stop-server', () => {
   
});

ipcMain.handle('save-dialog', async (event, options) => {
    const { filePath } = await dialog.showSaveDialog(options);
    return { filePath };
});