<script setup lang="ts">
import audioUrl from '../../../resources/mixkit-water-bubble-1317.wav'
import { useRouter } from 'vue-router'
const audio = new Audio(audioUrl)
// 监听来自主进程的播放提示音
window.electron.ipcRenderer.on('play-audio-from-main-process', () => {
  audio.play()
})

const router = useRouter()
window.electron.ipcRenderer.on('routerStrength', (_event, path, info) => {
  router.push({
    path: path,
    query: {
      ...info
    }
  })
})
</script>
<template>
  <RouterView />
</template>

<style scoped lang="scss"></style>
