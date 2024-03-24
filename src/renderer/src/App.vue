<script setup lang="ts">
import { watch, toRefs } from 'vue'
import { useDataStore } from '@renderer/store/dataStore'
import audioUrl from '../../../resources/mixkit-water-bubble-1317.wav'
const audio = new Audio(audioUrl)
// 监听来自主进程的播放提示音
window.electron.ipcRenderer.on('play-audio-from-main-process', () => {
  audio.play()
})

//监听全局系统设置变更，进行持久化
const dataStore = useDataStore()
dataStore.initAppData()
const { setting } = toRefs(dataStore)
for (const prop in setting.value) {
  watch(
    () => setting.value[prop],
    async (newValue) => {
      // 进行持久化
      await window.electron.ipcRenderer.invoke(
        'setData',
        `settingData.${prop}`,
        newValue
      )
      // 更新工作流
      await window.electron.ipcRenderer.invoke('upDataWork', prop, newValue)
    }
  )
}
</script>
<template>
  <RouterView />
</template>

<style scoped lang="scss"></style>
