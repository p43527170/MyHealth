import { app } from 'electron'
import AutoLaunch from 'auto-launch'

console.log(app.getPath('exe'))

// 创建一个自动启动实例
const autoLauncher = new AutoLaunch({
  name: '星璘健康', // 应用显示的名字
  path: app.getPath('exe') // 应用的可执行文件路径
})

export const systemWork = (info) => {
  const { powerOn } = info
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
  } else if (key == 'automaticUpgrade') {
    console.log('updata automaticUpgrade work')
  }
}
