import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeImage,
  Menu
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import iconSimple from '../../src/renderer/src/image/logobai.png?asset'
import Store from 'electron-store'
import { systemWork, upDataSystemWork } from './system'
import { startBusiness, updataMode, updataVoice, updataStringth } from './business'

const store = new Store()
let mainWindow: Electron.BrowserWindow | null = null
function toggleMainWindow() {
  if (mainWindow?.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow?.show()
    if (mainWindow?.isMinimized()) {
      mainWindow.restore()
    }
  }
}
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 480,
    height: 400,
    show: false,
    useContentSize: true,
    autoHideMenuBar: true,
    resizable: false,
    frame: false,
    maximizable: false,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  //执行系统设置和App业务
  ipcMain.handle('startWork', async () => {
    const info = await store.get('settingData')
    systemWork(info)
    const appData = await store.get('appData')
    startBusiness(appData as object)
  })
  //更新系统设置业务
  ipcMain.handle('upDataWork', async (_event, key, newValue) => {
    upDataSystemWork(key, newValue)
  })
  //更新App业务
  ipcMain.handle('upDataAppWork', async (_event, index, key, newValue) => {
    console.log(index, key, newValue)
    if(key === 'modeValue'){
      console.log(123);
      updataMode(newValue)
      updataVoice(newValue)
      updataStringth(newValue)
    }
  })
  //获取数据
  ipcMain.handle('getData', (_event, key) => {
    return store.get(key)
  })
  ipcMain.handle('setData', async (_event, key, value) => {
    store.set(key, value)
  })
  //窗口最小化
  ipcMain.handle('minimize', () => {
    mainWindow?.minimize()
  })
  //窗口关闭方法
  ipcMain.handle('close', () => {
    mainWindow?.hide()
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  // mainWindow.loadURL('10.78.20.114/login')
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  //创建系统托盘图标
  const trayImage = nativeImage.createFromPath(iconSimple)
  const tray = new Tray(trayImage)

  // 设置托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '设置',
      click: () =>
        function () {
          console.log('设置')
        }
    },
    {
      label: '重置提醒时间',
      click: () =>
        function () {
          console.log('重置提醒时间')
        }
    },
    { label: '显示/隐藏窗口', click: () => toggleMainWindow() },
    { label: '退出', click: () => app.quit() }
  ])
  tray.setToolTip('星璘健康')
  tray.setContextMenu(contextMenu)
  //托盘点击事件
  tray.on('click', () => {
    toggleMainWindow()
  })
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

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
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
