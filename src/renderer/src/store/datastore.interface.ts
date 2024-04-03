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

export type AllReminderItems = CommonReminderItem | CustomReminderItem

export interface Setting {
  powerOn: boolean
  automaticUpgrade: boolean
}
