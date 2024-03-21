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
    //获取本地所有数据-初始化业务
    async initAppData() {
      //获取appData数据，如果本地数据为空，则使用默认数据并持久化
      const appData = await window.electron.ipcRenderer.invoke(
        'getData',
        'appData'
      )
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
      //获取系统数据，如果本地数据为空，则使用默认数据并持久化
      const settingData = await window.electron.ipcRenderer.invoke(
        'getData',
        'settingData'
      )
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
      await window.electron.ipcRenderer.invoke('startWork')
    },
    //修改系统设置数据
    async toggleSetting(key: string, newValue: boolean) {
      console.log('修改系统设置')
      this.$patch((state) => {
        state.setting[key] = newValue
      })
    },
    //系统设置数据持久化-更新业务
    async updateSetting(key, newValue) {
      await window.electron.ipcRenderer.invoke(
        'setData',
        `settingData.${key}`,
        newValue
      )
      await window.electron.ipcRenderer.invoke('upDataWork', key, newValue)
    },
    //开关appData提醒-更新持久化数据
    async updateSwitch(index: number, value: boolean) {
      this.appData[index].switch = value
      this.updateAppData(index, 'switch', value)
    },
    //修改appData提醒详情-更新持久化数据
    async updateReminder(
      index: number,
      label: string,
      value: number | boolean
    ) {
      this.$patch((state) => {
        state.appData[index][label] = value
      })
      this.updateAppData(index, label, value)
    },
    //更新appData持久化数据-更新业务
    async updateAppData(
      index: number,
      key: string,
      newValue: boolean | number
    ) {
      await window.electron.ipcRenderer.invoke(
        'setData',
        `appData.${index}.${key}`,
        newValue
      )
      await window.electron.ipcRenderer.invoke(
        'upDataAppWork',
        index,
        key,
        newValue
      )
    }
  }
})
