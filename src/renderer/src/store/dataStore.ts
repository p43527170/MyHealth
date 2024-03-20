import { defineStore } from 'pinia'
import heshui from '../image/heshui.png'
import jiuzuo from '../image/jiuzuo.png'
import yanjing from '../image/yanjing.png'
import qita from '../image/qita.png'
interface AlarmConfig {
  reminderFrequency: number
  reminderCount: number
  reminderAction: ReminderActionType
}

enum ReminderActionType {
  ONLY_SOUND = '只有声音',
  WEAK_REMINDER = '弱提醒',
  MEDIUM_REMINDER = '中提醒',
  STRONG_REMINDER = '强提醒',
  SHUTDOWN = '关机'
}

interface CommonReminderItem {
  title: string
  url: string
  icon: string
  other: boolean
  switch?: boolean
  modeValue?: number
  voiceValue?: boolean
  strengthValue?: number
}

interface CustomReminderItem extends CommonReminderItem {
  allocation: number
  startup: number
  custom: AlarmConfig[] // 假设AlarmConfig是你之前定义的闹钟配置类型
}

type AllReminderItems = CommonReminderItem | CustomReminderItem

interface Setting {
  powerOn: boolean
  merge: boolean
  floatingWindow: boolean
  automaticUpgrade: boolean
}

export const useDataStore = defineStore('dataStore', {
  state: (): {
    buttonData: AllReminderItems[]
    setting: Setting
    reminderSettings: object
    strength: object
    voice: object
  } => ({
    buttonData: [
      {
        title: '护眼提醒',
        url: 'yanjing',
        switch: true,
        icon: yanjing,
        other: false,
        modeValue: 0,
        voiceValue: false,
        strengthValue:1
      },
      {
        title: '久坐提醒',
        url: 'jiuzuo',
        switch: true,
        icon: jiuzuo,
        other: false,
        modeValue: 0,
        voiceValue: false,
        strengthValue: 0
      },
      {
        title: '喝水提醒',
        url: 'heshui',
        switch: false,
        icon: heshui,
        other: false,
        modeValue: 0,
        voiceValue: true,
        strengthValue: 0
      },
      {
        title: '自定义提醒',
        allocation: 0,
        startup: 0,
        url: 'qita',
        icon: qita,
        other: true,
        custom: []
      }
    ],
    setting: {
      powerOn: true,
      merge: true,
      floatingWindow: false,
      automaticUpgrade: true
    },
    reminderSettings: {
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
    strength: ['弱', '中', '强'],
    voice: ['关', '开']
  }),
  getters: {
    // double: (state) => state.count * 2
  },
  actions: {
    //开关提醒
    updateSwitch(index: number, value: boolean) {
      this.buttonData[index].switch = value
    },
    //修改系统设置
    toggleSetting(key: string) {
      this.$patch((state) => {
        state.setting[key] = !state.setting[key]
      })
    },
    //修改提醒
    updateReminder(index: number, label: string, value: number | boolean) {
      this.$patch((state) => {
        console.log(state.buttonData[index][label])
        state.buttonData[index][label] = value
      })
      console.log(this.buttonData[index])
    }
  }
})
