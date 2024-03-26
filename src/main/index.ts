import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeImage,
  Menu,
  screen
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import iconSimple from '../../src/renderer/src/image/logobai.png?asset'
import Store from 'electron-store'
import { systemWork, upDataSystemWork } from './system'
import { startCustomIntervalTask, updataBusiness } from './mainBusiness'
const store = new Store()
export const allWindows: BrowserWindow[] = []
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
    backgroundColor: '#1b1b1f',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  allWindows.push(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  // mainWindow.loadURL('http://10.78.20.114/login')
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  //获取本地持久化数据
  ipcMain.handle('getData', (_event, key) => {
    return store.get(key)
  })
  //启动执行系统设置
  ipcMain.handle('startWork', async () => {
    const info = await store.get('settingData')
    systemWork(info)
  })
  //更新系统设置业务
  ipcMain.handle('upDataWork', async (_event, key, newValue) => {
    upDataSystemWork(key, newValue)
  })
  //初始化App业务
  ipcMain.handle('startRemind', (_event, index) => {
    startCustomIntervalTask(index)
  })
  //更新App业务
  ipcMain.handle('upDataAppWork', async (_event, index, key, newValue) => {
    updataBusiness(index, key, newValue)
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
    { label: '关于', role: 'about' },
    { label: '退出', role: 'quit' }
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
  app.setAppUserModelId('星璘健康提醒')

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

const strengthContext: BrowserWindow[] = []
let isWindowOpening = false
export const creatStrength1 = (info) => {
  if (isWindowOpening) {
    return
  }
  isWindowOpening = true
  console.log('new BrowserWindow')
  // 获取主屏幕尺寸
  const mainScreen = screen.getPrimaryDisplay()
  const { width } = mainScreen.size

  // 新建窗口，宽度和高度假设分别为800和600
  const winWidth = 340
  const winHeight = 90

  // 计算窗口的居中位置
  const x = Math.round((width - winWidth) / 2)
  const Strength1Window = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: x,
    y: 30,
    show: false,
    useContentSize: true,
    autoHideMenuBar: true,
    resizable: false,
    frame: false,
    maximizable: false,
    titleBarStyle: 'hidden',
    transparent: true,
    alwaysOnTop: true, // 可选，让窗口总在最前面显示
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  Strength1Window.on('ready-to-show', () => {
    if (strengthContext.length == 0) {
      Strength1Window?.show()
      strengthContext.push(Strength1Window)
    }
    console.log('ready-to-show')
  })
  Strength1Window.webContents.on('did-frame-finish-load', () => {
    // 确保窗口加载完成后再执行
    console.log('did-frame-finish-load')
    const windowToReceiveMessage = strengthContext[0]
    if (!windowToReceiveMessage.isDestroyed()) {
      windowToReceiveMessage.webContents.send('getStrength12Info', info)
    }
  })
  // 关闭窗口清空窗口序列
  Strength1Window.on('close', () => {
    strengthContext.shift()
    isWindowOpening = false
    console.log('close')
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    Strength1Window.loadURL(
      process.env['ELECTRON_RENDERER_URL'] + '/#/strength1'
    )
  } else {
    Strength1Window.loadFile(
      join(__dirname, '../renderer/src/views/strength2.vue')
    )
  }
}

export const creatStrength2 = (info) => {
  //已有窗口则退出方法 防止内存损耗
  if (strengthContext.length > 0) {
    return
  }
  const Strength2Window = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    useContentSize: true,
    autoHideMenuBar: true,
    resizable: false,
    frame: false,
    maximizable: false,
    titleBarStyle: 'hidden',
    transparent: true,
    alwaysOnTop: true, // 可选，让窗口总在最前面显示
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  Strength2Window.on('ready-to-show', () => {
    if (strengthContext.length == 0) {
      Strength2Window?.show()
      // Strength1Window.setFullScreen(true)
      strengthContext.push(Strength2Window)
    }
  })

  const window = allWindows[0]
  if (!window.isDestroyed()) {
    window.webContents.send('getStrength12Info', info)
  }

  // 关闭窗口清空窗口序列
  Strength2Window.on('close', () => {
    strengthContext.shift()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    Strength2Window.loadURL(
      process.env['ELECTRON_RENDERER_URL'] + '/#/strength2'
    )
  } else {
    Strength2Window.loadFile(
      join(__dirname, '../renderer/src/views/strength2.vue')
    )
  }
}

ipcMain.handle('closeStrength', () => {
  strengthContext[0].close()
})
