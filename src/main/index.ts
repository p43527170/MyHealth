import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeImage,
  Menu,
  screen,
  session,
  Notification
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import iconSimple from '../../src/renderer/src/image/logobai.png?asset'
import Store from 'electron-store'
import { systemWork, upDataSystemWork } from './system'
import { startCustomIntervalTask, updataBusiness, resetJobs } from './mainBusiness'
import { handleUpdate } from './autoUpdate'
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
    const info = await store.get('settingData') as unknown as { automaticUpgrade: boolean }
    handleUpdate(info.automaticUpgrade)
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
      click: () => {
        mainWindow?.show()
        allWindows[0].webContents.send('toSetting')
      }
    },
    {
      label: '重置提醒时间',
      click: () => {
        resetJobs()
      }
    },
    {
      label: '检查更新',
      click: () => {
        handleUpdate(false)
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

const strengthContext = {}
let strengthContextNum = -3
export const creatStrength1 = async (info) => {
  if (strengthContext[info.url]) {
    return
  }
  strengthContextNum = strengthContextNum + 4
  // 获取主屏幕尺寸
  const mainScreen = screen.getPrimaryDisplay()
  const { width } = mainScreen.size

  // 新建窗口，宽度和高度假设分别为800和600
  const winWidth = 340
  const winHeight = 110

  // 计算窗口的居中位置
  const x = Math.round((width - winWidth) / 2)
  const Strength1Window = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: x,
    y: 30 * strengthContextNum,
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
  Strength1Window.webContents.on('did-finish-load', () => {
    // 确保窗口加载完成后再执行
    console.log('did-finish-load', info)
    if (!strengthContext[info.url]) {
      strengthContext[info.url] = Strength1Window
      const windowToReceiveMessage = strengthContext[info.url]
      if (!windowToReceiveMessage.isDestroyed()) {
        setTimeout(() => {
          windowToReceiveMessage.webContents.send('routerStrength', '/strength1', info)
          Strength1Window?.show()
        }, 200)
      }
    }
  })
  // 关闭窗口清空窗口序列
  Strength1Window.on('close', () => {
    strengthContext[info.url] = null
    strengthContextNum = strengthContextNum - 4
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    await Strength1Window.loadURL(
      process.env['ELECTRON_RENDERER_URL'] + '/#/strength1'
    )
  } else {
    await Strength1Window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

export const creatStrength2 = async (info) => {
  //已有窗口则退出方法 防止内存损耗
  if (strengthContext[info.url]) {
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
  // 确保窗口加载完成后再执行传参
  Strength2Window.webContents.on('did-finish-load', () => {
    // 确保窗口加载完成后再执行
    if (!strengthContext[info.url]) {
      strengthContext[info.url] = Strength2Window
      const windowToReceiveMessage = strengthContext[info.url]
      if (!windowToReceiveMessage.isDestroyed()) {
        setTimeout(() => {
          windowToReceiveMessage.webContents.send('routerStrength', '/strength2', info)
          Strength2Window.show()
        }, 200)
      }
    }
  })
  // 关闭窗口清空窗口序列
  Strength2Window.on('close', () => {
    strengthContext[info.url] = null
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    await Strength2Window.loadURL(
      process.env['ELECTRON_RENDERER_URL'] + '/#/strength2'
    )
  } else {
    await Strength2Window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('closeStrength', (_event, name) => {
  if (strengthContext[name]) {
    strengthContext[name].close()
  }
})
ipcMain.handle('clear-all-data-and-cache', () => {
  session.defaultSession.clearCache()
  // // 清理用户数据文件夹（Node.js v12.10.0+）
  const userDataPath = app.getPath('userData')
  // fs.rm(userDataPath, { recursive: true, force: true }, (err) => {
  //   if (err) {
  //     if (err.code === 'ENOENT') {
  //       console.log('目录不存在');
  //     } else if (err.code === 'EBUSY') {
  //       console.warn(`资源正忙或被锁定，无法删除 ${err}`)
  //     } else {
  //       console.error('删除文件夹时发生错误:', err)
  //     }
  //   } else {
  //     console.log('Electron应用数据已清除');
  //   }
  // })
  const notification = new Notification({
    title: '缓存已清空',
    body: '路径：' + userDataPath,
    silent: true, // 禁止系统音
    timeoutType: 'default', //default || never
    icon: nativeImage.createFromPath(iconSimple)
  })
  notification.show()
})