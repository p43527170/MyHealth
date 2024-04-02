import { Notification, nativeImage } from 'electron'
import schedule from 'node-schedule'
import Store from 'electron-store'
const store = new Store()
import yanjing from '../../src/renderer/src/image/yanjing.png?asset'
import jiuzuo from '../../src/renderer/src/image/jiuzuo.png?asset'
import heshui from '../../src/renderer/src/image/heshui.png?asset'
import qita from '../../src/renderer/src/image/qita.png?asset'
import logo from '../../src/renderer/src/image/logobai.png?asset'
import { allWindows, creatStrength1, creatStrength2 } from './index'

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
    const jobWithReminder = scheduler.jobs[index]
    if (jobWithReminder && jobWithReminder.reminder) {
      jobWithReminder.reminder.updateReminderSettings('voice', newValue)
    }
  }
}

const reminderSettings = {
  yanjing: [
    {
      title: '20-20-20 护眼法',
      text: '请向 20 英尺（6米）外眺望 20 秒',
      time: 2
    },
    {
      title: '一小时护眼法',
      text: '请闭眼或眺望远方 1 ~ 5 分钟',
      time: 60
    }
  ],
  jiuzuo: [
    {
      title: '一小时久坐提醒',
      text: '一小时啦，请起身活动 1 分钟',
      time: 3
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
      time: 5
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
    return new Date(now.getTime() + intervalInMinutes * 60 * 1000)
  }

  //执行提醒
  executeReminder(notificationManager: NotificationManager) {
    // const currentInfo = this.getInfo()
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
        creatStrength1(this.getInfo())
        break
      case 2:
        creatStrength2(this.getInfo())
        break
      default:
        console.error('Invalid reminder strength')
        break
    }
    // 重新调度提醒任务
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
    scheduler.scheduleReminder(this)
  }

  // 新增一个方法用于更新提醒属性
  public updateReminderSettings(type: string, value: number | boolean) {
    if (type) {
      this.modeValue = value as number
      this.voiceValue = value as boolean
      this.strengthValue = value as number
    }
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
  public jobs: ScheduledReminder[] = []
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
    const job = schedule.scheduleJob(reminder.calculateNextExecution(), () => {
      reminder.executeReminder(this.notificationManager)
    })
    if (job) {
      this.jobs[reminder.index] = { job: job, reminder } // 关联Job和Reminder
    }
  }
}

// NotificationManager类，负责处理通知
class NotificationManager {
  showNotification(
    title: string,
    body: string,
    playAudio: boolean,
    index: number
  ) {
    const notification = new Notification({
      title: title,
      body: body,
      silent: true, // 禁止系统音
      timeoutType: 'default', //default || never
      icon: myImage[index]
    })
    notification.show()
    if (playAudio) {
      this.palyVoice()
    }
  }
  private palyVoice() {
    const window = allWindows[0]
    if (!window.isDestroyed()) {
      window.webContents.send('play-audio-from-main-process')
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
}

// 初始化和使用
const notificationManager = new NotificationManager()
export const scheduler = new ReminderScheduler(notificationManager)
