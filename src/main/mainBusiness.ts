import { Notification, nativeImage } from 'electron'
import schedule from 'node-schedule'
import Store from 'electron-store'
const store = new Store()
import yanjing from '../../src/renderer/src/image/yanjing.png?asset'
import jiuzuo from '../../src/renderer/src/image/jiuzuo.png?asset'
import heshui from '../../src/renderer/src/image/heshui.png?asset'
import qita from '../../src/renderer/src/image/qita.png?asset'
import { allWindows, creatStrength1, creatStrength2 } from './index'

const myImage = {
  0: nativeImage.createFromPath(yanjing),
  1: nativeImage.createFromPath(jiuzuo),
  2: nativeImage.createFromPath(heshui),
  3: nativeImage.createFromPath(qita)
}
const jobs = {}

export const updataBusiness = (
  index: number,
  key: string,
  newValue: number | boolean
) => {
  if (key + 'Updata' in methods) {
    methods[key + 'Updata'](index, newValue)
  }
}

const methods = {
  switchUpdata: (index: number, newValue: boolean) => {
    if (newValue) {
      console.log('change', index, newValue);
      startCustomIntervalTask(index)
    } else {
      jobs[index].cancel()
    }
  }
  // modeValueUpdata: (index: number, newValue: number) => {
  //   console.log(index, newValue, 'modeValueUpdata')
  // }
  // voiceValueUpdata: (index: number, newValue: boolean) => {
  //   console.log(index, newValue, 'voiceValueUpdata')
  // },
  // strengthValueUpdata: (index: number, newValue: number) => {
  //   console.log(index, newValue, 'strengthValueUpdata')
  // }
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
      time: 1
    }
  ],
  jiuzuo: [
    {
      title: '一小时久坐提醒',
      text: '一小时啦，请起身活动 1 分钟',
      time: 1
    },
    {
      title: '两小时久坐提醒',
      text: '两小时啦，请起身活动 1 分钟',
      time: 1
    }
  ],
  heshui: [
    {
      title: '半小时喝水提醒',
      text: '半小时啦，记得喝水',
      time: 1
    },
    {
      title: '一小时久坐提醒',
      text: '一小时啦，记得喝水',
      time: 1
    },
    {
      title: '两小时久坐提醒',
      text: '每隔 120 分钟，提醒喝水 1 次',
      time: 1
    }
  ]
}

//定时提醒任务创建
export const startCustomIntervalTask = async (index: number) => {
  const appData = (await store.get('appData')) as []
  const info = appData[index]
  const { title, url, modeValue, voiceValue, strengthValue } = info
  // 获取模式
  const mode = reminderSettings[url]
  const modeType = mode[modeValue] as { time: number; text: string }
  console.log('start', url, 'strengthValue = ' + strengthValue, 'index = ' + index)
  // 计算本模式的循环间隔intervalInMinutes
  const intervalInMinutes = modeType.time //时间间隔分钟
  const now = new Date()
  const nextExecution = new Date(now.getTime() + intervalInMinutes * 60 * 1000);
  //计算提醒强度
  strengthJudge(
    strengthValue,
    nextExecution,
    modeType.text,
    title,
    voiceValue,
    index,
    url,
    modeValue
  )
}

/*
  强度判断
  0: 低
  1: 中
  2: 高
*/
const strengthJudge = (
  strength: number,
  time: Date,
  text: string,
  title: string,
  voiceValue: boolean,
  index: number,
  url,
  modeValue
) => {
  console.log('strength', url, 'strengthValue = ' + strength, 'index = ' + index)
  clearJob(index)
  if (strength === 0) {
    const notification = new Notification({
      title: title,
      body: text,
      silent: true, // 禁止系统音
      timeoutType: 'default', //default || never
      icon: myImage[index]
    })
    const job = schedule.scheduleJob(time, function () {
      //执行任务
      notification.show()
      if (voiceValue) {
        const window = allWindows[0]
        if (!window.isDestroyed()) {
          window.webContents.send('play-audio-from-main-process')
        }
      }
      // 任务执行完后，重新安排下一次执行
      startCustomIntervalTask(index)
    })
    jobs[index] = job
  } else if (strength === 1) {
    const job = schedule.scheduleJob(time, function () {
      const info = {
        voiceValue,
        title,
        url,
        index,
        modeValue
      }
      //执行任务
      creatStrength1(info)
      if (voiceValue) {
        const window = allWindows[0]
        if (!window.isDestroyed()) {
          window.webContents.send('play-audio-from-main-process')
        }
      }
      // 任务执行完后，重新安排下一次执行
      startCustomIntervalTask(index)
    })
    jobs[index] = job
  } else if (strength === 2) {
    const job = schedule.scheduleJob(time, function () {
      const info = {
        voiceValue,
        title,
        url,
        index,
        modeValue
      }
      //执行任务
      creatStrength2(info)
      if (voiceValue) {
        const window = allWindows[0]
        if (!window.isDestroyed()) {
          window.webContents.send('play-audio-from-main-process')
        }
      }
      // 任务执行完后，重新安排下一次执行
      startCustomIntervalTask(index)
    })
    jobs[index] = job
  } else {
    console.log('strengthJudge error')
  }
}
// 增加一个清除已有定时任务的方法
const clearJob = (index: number) => {
  const job = jobs[index]
  if (job) {
    job.cancel()
    delete jobs[index]
  }
}
