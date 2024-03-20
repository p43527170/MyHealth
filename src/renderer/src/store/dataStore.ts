import { defineStore } from 'pinia'
import heshui from '../image/heshui.png'
import jiuzuo from '../image/jiuzuo.png'
import yanjing from '../image/yanjing.png'
import qita from '../image/qita.png'
export const useDataStore = defineStore('dataStore', {
  state: () => ({
    buttonData: [
      {
        title: '护眼提醒',
        mode: '20-20-20 护眼法',
        voice: '关',
        strength: '中',
        url: 'yanjing',
        switch: true,
        icon: yanjing,
        other: false
      },
      {
        title: '久坐提醒',
        mode: '一小时久坐提醒',
        voice: '关',
        strength: '低',
        url: 'jiuzuo',
        switch: true,
        icon: jiuzuo,
        other: false
      },
      {
        title: '喝水提醒',
        mode: '1小时喝水提醒',
        voice: '关',
        strength: '中',
        url: 'heshui',
        switch: false,
        icon: heshui,
        other: false
      },
      {
        title: '自定义提醒',
        allocation: 0,
        startup: 0,
        url: 'qita',
        icon: qita,
        other: true
      }
    ],
    setting: {
      powerOn: true
    }
  }),
  getters: {
    // double: (state) => state.count * 2
  },
  actions: {
    updateSwitch(index: number, value: boolean) {
      this.buttonData[index].switch = value
    }
  }
})
