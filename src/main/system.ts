import { app } from 'electron'
import { AutoLaunch } from 'auto-launch'

// 创建一个自动启动实例
const autoLauncher = new AutoLaunch({
  name: '你的应用名称', // 应用显示的名字
  path: app.getPath('exe'), // 应用的可执行文件路径
});

// 启用开机自启动
autoLauncher.enable().catch(err => console.error(err));

// 检查是否已设置为开机启动
autoLauncher.isEnabled().then(enabled => {
  if (enabled) {
    console.log('应用已设置为开机自启动');
  } else {
    console.log('应用未设置为开机自启动');
  }
});

export const systemWork = (info: {
  powerOn: boolean
  merge: boolean
  floatingWindow: boolean
  automaticUpgrade: boolean
}) => {

  const { powerOn, merge, floatingWindow, automaticUpgrade } = info
  console.log(powerOn, merge, floatingWindow, automaticUpgrade)
}
