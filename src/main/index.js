import { app, BrowserWindow, Menu } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let loadWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const winURL2 = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/load.html`
    : `file://${__dirname}/load.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    useContentSize: true,
    width: 1000,
    resizable:false,
    show: false
  })

  loadWindow = new BrowserWindow({
    height:320,
    width:320,
    useContentSize:true,
    frame:false,
    resizable:false,
  })

  loadWindow.loadURL(winURL2)
  mainWindow.loadURL(winURL)

  loadWindow.on('closed',()=>{
    loadWindow = null
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    loadWindow.close()
  })

  mainWindow.on('ready-to-show',function () {
    mainWindow.show()
    loadWindow.hide()

  })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
