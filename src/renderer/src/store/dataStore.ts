import { defineStore } from 'pinia'
import heshui from '../image/heshui.png'
import jiuzuo from '../image/jiuzuo.png'
import yanjing from '../image/yanjing.png'
import qita from '../image/qita.png'
import { Setting, AllReminderItems } from './datastore.interface'

//默认初始数据
const defaultSetting: AllReminderItems[] = [
  {
    title: '护眼提醒',
    url: 'yanjing',
    switch: true,
    icon: yanjing,
    other: false,
    modeValue: 0,
    voiceValue: false,
    strengthValue: 1
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
]
const defaultSystemSettings: Setting = {
  powerOn: true,
  merge: false,
  floatingWindow: false,
  automaticUpgrade: false
}
export const useDataStore = defineStore('dataStore', {
  state: (): {
    appData: AllReminderItems[]
    setting: Setting
    reminderSettings: object
    strength: object
    voice: object
  } => ({
    appData: [],
    setting: {
      powerOn: false,
      merge: false,
      floatingWindow: false,
      automaticUpgrade: false
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
    async updateSwitch(index: number, value: boolean) {
      this.appData[index].switch = value
      await window.electron.ipcRenderer.invoke(
        'setData',
        `appData.${index}.switch`,
        value
      )
    },
    //修改系统设置
    async toggleSetting(key: string, newValue: boolean) {
      this.$patch((state) => {
        state.setting[key] = newValue
      })
      await window.electron.ipcRenderer.invoke(
        'setData',
        `settingData.${key}`,
        newValue
      )
    },
    //修改提醒
    async updateReminder(
      index: number,
      label: string,
      value: number | boolean
    ) {
      this.$patch((state) => {
        state.appData[index][label] = value
      })
      await window.electron.ipcRenderer.invoke(
        'setData',
        `appData.${index}.${label}`,
        value
      )
    },
    //获取用户数据
    async initAppData() {
      const appData = await window.electron.ipcRenderer.invoke(
        'getData',
        'appData'
      )
      console.log(appData)
      if (
        appData === undefined ||
        appData === null ||
        appData === '' ||
        appData.length === 0
      ) {
        this.appData = defaultSetting
        await window.electron.ipcRenderer.invoke(
          'setData',
          'appData',
          defaultSetting
        )
      } else {
        this.appData = appData
      }
      const settingData = await window.electron.ipcRenderer.invoke(
        'getData',
        'settingData'
      )
      //判断如果对象为空，则使用默认设置
      if (
        settingData === null ||
        settingData === undefined ||
        settingData === ''
      ) {
        this.setting = defaultSystemSettings
        await window.electron.ipcRenderer.invoke(
          'setData',
          'settingData',
          defaultSystemSettings
        )
      } else {
        this.setting = settingData
      }
      await window.electron.ipcRenderer.invoke('startWork', 'settingData')
    }
  }
})
