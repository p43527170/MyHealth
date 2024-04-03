import { autoUpdater } from 'electron-updater'
import { dialog, Notification } from 'electron'
export function handleUpdate(flag: boolean) {
  // 开启开发环境下的更新检查
  // autoUpdater.forceDevUpdateConfig = true
  // 或者允许预发布版本更新
  // autoUpdater.allowPrerelease = true
  autoUpdater.autoDownload = flag //是否自动下载
  //开始检查更新
  // autoUpdater.checkForUpdates()
  autoUpdater.checkForUpdatesAndNotify().catch((err) => {
    const notification = new Notification({
      title: '更新提示',
      body: 'Github 网络连接失败:' + err
    })
    notification.show()
  })
  if (!flag) {
    autoUpdater.on('update-available', (res) => {
      if (res !== null) {
        sendUpdateMessage({
          cmd: 'info',
          message: '发现可用更新版本：' + res.version + ' 是否更新'
        })
      }
    })
  }
  // 监听无可用更新事件
  // autoUpdater.on('update-not-available', function (message) {
  //   console.log(message)
  //   sendUpdateMessage({
  //     cmd: 'info',
  //     message: '无更新'
  //   })
  // })
  // let loading = true
  // 监听升级失败事件
  // if (loading) {
  //   autoUpdater.on('error', function (error) {
  //     console.log(error)
  //     sendUpdateMessage({
  //       cmd: 'error',
  //       message: '网络错误升级失败，是否重试'
  //     })
  //   })
  // }
  // 更新下载进度事件 有空做个进度条
  // autoUpdater.on('download-progress', function (progressObj) {
  //   console.log(progressObj.percent)
  //   loading = true
  // })
  //监听下载完成事件
  autoUpdater.on('update-downloaded', function (releaseNotes) {
    const notification = new Notification({
      title: releaseNotes.version + ' 下载完毕',
      body: '开始运行更新程序'
    })
    notification.show()
    //退出并安装更新包
    autoUpdater.quitAndInstall()
  })
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
