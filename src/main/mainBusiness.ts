import { Notification, nativeImage, screen, BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import schedule from 'node-schedule'
import Store from 'electron-store'
const store = new Store()
import yanjing from '../../src/renderer/src/image/yanjing.png?asset'
import jiuzuo from '../../src/renderer/src/image/jiuzuo.png?asset'
import heshui from '../../src/renderer/src/image/heshui.png?asset'
import qita from '../../src/renderer/src/image/qita.png?asset'
import logo from '../../src/renderer/src/image/logobai.png?asset'
import { allWindows } from './index'

const myImage = {
  0: nativeImage.createFromPath(yanjing),
  1: nativeImage.createFromPath(jiuzuo),
  2: nativeImage.createFromPath(heshui),
  3: nativeImage.createFromPath(qita)
}

export const updataBusiness = (
  index: number,
  key: string,
  newValue: number | boolean
) => {
  if (key == 'switch') {
    if (newValue) {
      scheduler.startCustomIntervalTask(index)
    } else {
      scheduler.cancelReminder(index)
    }
  } else {
    scheduler.updateReminder(index, key, newValue)
  }
}

const reminderSettings = {
  yanjing: [
    {
      title: '20-20-20 护眼法',
      text: '请向 20 英尺（6米）外眺望 20 秒',
      time: 1
    },
    {
      title: '一小时护眼法',
      text: '请闭眼或眺望远方 1 ~ 5 分钟',
      time: 0.2
    }
  ],
  jiuzuo: [
    {
      title: '一小时久坐提醒',
      text: '一小时啦，请起身活动 1 分钟',
      time: 0.3
    },
    {
      title: '两小时久坐提醒',
      text: '两小时啦，请起身活动 1 分钟',
      time: 120
    }
  ],
  heshui: [
    {
      title: '半小时喝水提醒',
      text: '半小时啦，记得喝水',
      time: 0.4
    },
    {
      title: '一小时喝水提醒',
      text: '一小时啦，记得喝水',
      time: 60
    },
    {
      title: '两小时喝水提醒',
      text: '每隔 120 分钟，提醒喝水 1 次',
      time: 120
    }
  ]
}

interface ReminderInfo {
  voiceValue: boolean
  title: string
  url: string
  index: number
  modeValue: number
  strengthValue?: number
  switch?: boolean
}
export interface StrengthWindowOptions {
  width: number
  height: number
  x?: number
  y?: number
}
// Reminder类，负责提醒的相关信息和方法
class Reminder {
  constructor(
    public title: string,
    public url: string,
    public modeValue: number,
    public voiceValue: boolean,
    public strengthValue: number | undefined,
    public index: number,
    public info: { time: number; text: string }
  ) {
    this.info = (reminderSettings[this.url]?.[this.modeValue] as {
      time: number
      text: string
    }) || { time: 0, text: '' }
  }
  //获取提醒时间点
  calculateNextExecution(): Date {
    const intervalInMinutes = this.info.time
    const now = new Date()
    console.log('calculateNextExecution')
    return new Date(now.getTime() + intervalInMinutes * 60 * 1000)
  }

  //执行提醒
  executeReminder(notificationManager: NotificationManager) {
    console.log('executeReminder', this.url, this.index, this.info.time)
    switch (this.strengthValue) {
      case 0:
        notificationManager.showNotification(
          this.title,
          this.info.text,
          this.voiceValue,
          this.index
        )
        break
      case 1:
        notificationManager.createStrengthWindow(
          this.getInfo(),
          {
            width: 340,
            height: 110,
            x: 10,
            y: 10
          },
          '/strength1'
        )
        break
      case 2:
        notificationManager.createStrengthWindow(
          this.getInfo(),
          {
            width: 1920,
            height: 1080
          },
          '/strength2'
        )
        break
      default:
        console.error('Invalid reminder strength')
        break
    }
    // 重新调度提醒任务
    this.info = reminderSettings[this.url]?.[this.modeValue]
    console.log(44444);
    this.rescheduleReminder(scheduler)
  }
  // 需要传递的提醒信息
  private getInfo(): ReminderInfo {
    return {
      voiceValue: this.voiceValue,
      title: this.title,
      url: this.url,
      index: this.index,
      modeValue: this.modeValue
    }
  }
  //重新调度提醒任务
  rescheduleReminder(scheduler: ReminderScheduler) {
    console.log('00000');
    scheduler.scheduleReminder(this)
  }

  // 更新当前提醒属性
  public updateReminderSettings(type: string, value: number | boolean) {
    this[type] = value
  }
}
interface Job {
  cancel(): void
}
interface ScheduledReminder {
  job: Job
  reminder: Reminder
}
// ReminderScheduler类，负责调度提醒任务
class ReminderScheduler {
  private jobs: ScheduledReminder[] = []
  constructor(private notificationManager: NotificationManager) {}

  //创建提醒
  private createReminder(info: ReminderInfo): Reminder {
    return new Reminder(
      info.title,
      info.url,
      info.modeValue,
      info.voiceValue,
      info.strengthValue,
      info.index,
      { time: 20, text: '' }
    )
  }
  //开始定时任务
  async startCustomIntervalTask(index: number) {
    const appData = (await store.get('appData')) as ReminderInfo[]
    if (appData[index]) {
      appData[index].index = index
      const reminder = this.createReminder(appData[index])
      reminder.rescheduleReminder(this)
    }
  }

  //取消任务
  cancelReminder(index: number) {
    const job = this.jobs[index]
    if (job) {
      job.job.cancel()
      delete this.jobs[index]
    }
  }

  //重置所有提醒任务
  async resetAllReminders() {
    // 取消并清空所有正在运行的任务
    this.jobs.forEach((job) => job && job.job.cancel())
    this.jobs.length = 0
    // 重新从 appData 加载并调度所有提醒任务（前提是开关打开）
    const appData = (await store.get('appData')) as ReminderInfo[]
    appData.forEach((item, index) => {
      if (item.switch) {
        console.log(item)
        item.index = index
        const reminder = this.createReminder(item)
        reminder.rescheduleReminder(this)
      }
    })
    this.notificationManager.showNotificationRe()
  }

  //调度提醒任务
  scheduleReminder(reminder: Reminder) {
    this.cancelReminder(reminder.index)
    console.log(1111);
    const job = schedule.scheduleJob(reminder.calculateNextExecution(), () => {
      reminder.executeReminder(this.notificationManager)
    })
    if (job) {
      this.jobs[reminder.index] = { job: job, reminder } // 关联Job和Reminder
    }
  }
  //更新提醒任务
  updateReminder(index, key, newValue) {
    const jobWithReminder = this.jobs[index]
    if (jobWithReminder && jobWithReminder.reminder) {
      jobWithReminder.reminder.updateReminderSettings(key, newValue)
    }
  }
}

// NotificationManager类，负责处理通知
export const strengthContext = {}
class NotificationManager {
  private strengthContextNum = -3
  showNotification(
    title: string,
    body: string,
    playAudio: boolean,
    index: number
  ) {
    console.log('streng0')
    const notification = new Notification({
      title: title,
      body: body,
      silent: true, // 禁止系统音
      timeoutType: 'default', //default || never
      icon: myImage[index]
    })
    notification.show()
    this.palyVoice(playAudio)
  }
  private palyVoice(playAudio) {
    if (playAudio) {
      const window = allWindows[0]
      if (!window.isDestroyed()) {
        window.webContents.send('play-audio-from-main-process')
      }
    }
  }
  showNotificationRe() {
    const notification = new Notification({
      title: '重置提醒时间',
      body: '所有提醒将重新开始计时',
      silent: true, // 禁止系统音
      timeoutType: 'default', //default || never
      icon: nativeImage.createFromPath(logo)
    })
    notification.show()
  }
  async createStrengthWindow(
    info: ReminderInfo,
    options: StrengthWindowOptions,
    routerPath: string
  ) {
    if (strengthContext[info.url]) {
      return
    }
    const mainScreen = screen.getPrimaryDisplay()
    const { width } = mainScreen.size
    if (options.x) {
      this.strengthContextNum = this.strengthContextNum + 4
      options.x = Math.round((width - options.width) / 2)
      options.y = 30 * this.strengthContextNum // 如果需要根据不同的窗口类型动态计算y坐标，可以在这里修改
    }
    const optionObj = {
      ...options,
      show: false,
      useContentSize: true,
      autoHideMenuBar: true,
      titleBarStyle: 'hidden' as 'default' | 'hidden',
      resizable: false,
      frame: false,
      maximizable: false,
      transparent: true,
      alwaysOnTop: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    }
    const windowInstance = new BrowserWindow(optionObj)
    //确保页面载入完毕后执行
    windowInstance.webContents.on('did-finish-load', () => {
      if (!strengthContext[info.url]) {
        strengthContext[info.url] = windowInstance
        if (!windowInstance.isDestroyed()) {
          setTimeout(() => {
            windowInstance.webContents.send('routerStrength', routerPath, info)
            this.palyVoice(info.voiceValue)
            windowInstance.show()
          }, 200)
        }
      }
    })
    windowInstance.on('close', () => {
      console.log(routerPath)
      strengthContext[info.url] = null
      // 根据实际情况决定是否需要针对不同窗口类型调整 strengthContextNum
      if (routerPath === '/strength1') {
        this.strengthContextNum = this.strengthContextNum - 4
      }
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      await windowInstance.loadURL(
        `${process.env['ELECTRON_RENDERER_URL']}/${routerPath}`
      )
    } else {
      await windowInstance.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }
}

// 初始化和使用
const notificationManager = new NotificationManager()
export const scheduler = new ReminderScheduler(notificationManager)
