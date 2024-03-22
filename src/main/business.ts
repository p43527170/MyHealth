import { Notification,nativeImage } from 'electron'
import schedule from 'node-schedule'

const jobs: object[] = []
export const startBusiness = (info: object) => {
  // 定义定时任务规则，每隔 20 分钟执行一次
  const rule = new schedule.RecurrenceRule()
  rule.second = new schedule.Range(0, 59, 10)
  // 安排定时任务
  for (let i = 0; i < 3; i++) {
    const job = schedule.scheduleJob(rule, remindTask.bind(null, info[i], i))
    jobs.push(job)
  }
}

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
    console.log(index, newValue, 'switchUpdata')
  },
  modeValueUpdata: (index: number, newValue: number) => {
    console.log(index, newValue, 'modeValueUpdata')
  },
  voiceValueUpdata: (index: number, newValue: boolean) => {
    console.log(index, newValue, 'voiceValueUpdata')
  },
  strengthValueUpdata: (index: number, newValue: number) => {
    console.log(index, newValue, 'strengthValueUpdata')
  }
}

function remindTask(info: object, i:number) {
  if(i === 0){
    const myImage = nativeImage.createFromPath(
      '../renderer/src/image/yanjing.png?asset'
    )
    const notification = new Notification({
      title: info.title,
      body: '请眺望 20 英尺（6米）外，休息20秒',
      silent: true, // 根据 store 中的设置决定是否静音
      timeoutType: 'default', //default || never
      icon: myImage
    }).show()
  }
}

const reminderSettings = {
  yanjing: [
    {
      title: '20-20-20 护眼法',
      text: '持续用眼 20 分钟，向 20 英尺外眺望 20 秒'
    },
    {
      title: '一小时护眼法',
      text: '持续用眼 1 小时， 闭眼或眺望远方 1 ~ 5 分钟'
    }
  ],
  jiuzuo: [
    {
      title: '一小时久坐提醒',
      text: '每持续工作 60 分钟，提醒活动 1 分钟'
    },
    {
      title: '两小时久坐提醒',
      text: '每持续工作 120 分钟，提醒活动 1 分钟'
    }
  ],
  heshui: [
    {
      title: '半小时喝水提醒',
      text: '每隔 30 分钟，提醒喝水 1 次'
    },
    {
      title: '一小时久坐提醒',
      text: '每隔 60 分钟，提醒喝水 1 次'
    },
    {
      title: '两小时久坐提醒',
      text: '每隔 120 分钟，提醒喝水 1 次'
    }
  ]
},