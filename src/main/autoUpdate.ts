import { autoUpdater } from 'electron-updater'
import { dialog } from 'electron'
export function handleUpdate(flag: boolean) {
  // 开启开发环境下的更新检查
  autoUpdater.forceDevUpdateConfig = true
  // 或者允许预发布版本更新
  autoUpdater.allowPrerelease = true
  autoUpdater.checkForUpdatesAndNotify().catch()
  autoUpdater.autoDownload = flag //是否自动下载
  //设置更新包的地址
  //监听无可用更新
  // autoUpdater.on('update-not-available', function (message) {
  //   console.log(message)
  //   sendUpdateMessage({
  //     cmd: 'info',
  //     message: '无更新'
  //   })
  // })
  let loading = false
  //监听升级失败事件
  if (!flag) {
    if (loading) {
      autoUpdater.on('error', function (error) {
        console.log(error)
        sendUpdateMessage({
          cmd: 'error',
          message: '网络错误升级失败，是否重试'
        })
      })
    }
    //监听发现可用更新事件
    autoUpdater.on('update-available', function (message) {
      console.log(message)
      sendUpdateMessage({
        cmd: 'info',
        message: '发现可用更新版本：' + message.version + '是否更新'
      })
    })
  }
  // 更新下载进度事件 有空做个进度条
  autoUpdater.on('download-progress', function (progressObj) {
    console.log(progressObj.percent)
    loading = true
  })
  //监听下载完成事件
  autoUpdater.on('update-downloaded', function (releaseNotes) {
    console.log(releaseNotes)
    sendUpdateMessage({
      cmd: 'info',
      message: '下载完毕，开始更新',
      noButton: true
    })
    //退出并安装更新包
    autoUpdater.quitAndInstall()
  })
  // //新增
  // ipcMain.on('quit-install', () => {
  //   autoUpdater.quitAndInstall()
  // })
  // //接收渲染进程消息，开始检查更新
  // ipcMain.on('checkForUpdate', () => {
  //   //执行自动更新检查
  //   // sendUpdateMessage({cmd:'checkForUpdate',message:arg})
  //   autoUpdater.checkForUpdates()
  // })
}
//给渲染进程发送消息
function sendUpdateMessage(text) {
  dialog
    .showMessageBox({
      type: text.cmd,
      title: '提示',
      message: text.message,
      buttons: text.noButton ? ['是'] : ['是', '否']
    })
    .then((res) => {
      if (res.response === 0) {
        autoUpdater.downloadUpdate()
      } else {
        return
      }
    })
}
