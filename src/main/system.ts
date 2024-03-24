import { app } from 'electron'
import AutoLaunch from 'auto-launch'

console.log(app.getPath('exe'))

// 创建一个自动启动实例
const autoLauncher = new AutoLaunch({
  name: '星璘健康', // 应用显示的名字
  path: app.getPath('exe') // 应用的可执行文件路径
})

export const systemWork = (info) => {
  const { powerOn, merge, floatingWindow, automaticUpgrade } = info
  // 启用开机自启动
  if (powerOn) {
    autoLauncher.enable().catch((err) => console.error(err))
  } else {
    autoLauncher.isEnabled().then((enabled) => {
      if (enabled) {
        autoLauncher.disable().catch((err) => console.error(err))
      }
    })
  }
  //是否合并消息
  if (merge) {
    console.log('true,merge')
  }
  //是否开启悬浮窗
  if (floatingWindow) {
    console.log('true,floatingWindow')
  }
  //是否自动更新
  if (automaticUpgrade) {
    console.log('true,automaticUpgrade')
  }
}

export const upDataSystemWork = (key, value) => {
  // 启用开机自启动
  if (key == 'powerOn') {
    if (value) {
      autoLauncher.enable().catch((err) => console.error(err))
    } else {
      autoLauncher.isEnabled().then((enabled) => {
        if (enabled) {
          autoLauncher.disable().catch((err) => console.error(err))
        }
      })
    }
  } else if (key == 'merge') {
    console.log('updata merge work')
  } else if (key == 'floatingWindow') {
    console.log('updata floatingWindow work')
  } else if (key == 'automaticUpgrade') {
    console.log('updata automaticUpgrade work')
  }
}
