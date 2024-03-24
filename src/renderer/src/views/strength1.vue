<template>
  <div class="strengthBackground" @dblclick="close">
    <div style="text-align: center">
      <img :src="info.img" alt="" />
      <span>{{ info.title }}</span>
      <h4 style="color: #ffffff">请休息 {{ num }} 秒</h4>
      <p>双击鼠标左键关闭提示框</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const info = ref({})
window.electron.ipcRenderer.on('getStrength12Info', (_event, value) => {
  info.value = value
  console.log(info.value.img)
})

const close = () => {
  window.electron.ipcRenderer.invoke('closeStrength')
}
// 添加事件监听器
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}
const num = ref(20)
let intervalId
// 每秒减少1的定时器函数
const decreaseNum = () => {
  num.value--
  // 当num值为0时，清除定时器
  if (num.value === 0) {
    clearInterval(intervalId)
    close()
  }
}
// 在组件挂载后添加事件监听
onMounted(() => {
  intervalId = setInterval(decreaseNum, 1000)
  window.addEventListener('keydown', handleKeyDown)
})
// 在组件卸载前移除事件监听
onUnmounted(() => {
  clearInterval(intervalId)
  window.removeEventListener('keydown', handleKeyDown)
})

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
      time: 120
    }
  ],
  heshui: [
    {
      title: '半小时喝水提醒',
      text: '半小时啦，记得喝水',
      time: 30
    },
    {
      title: '一小时久坐提醒',
      text: '一小时啦，记得喝水',
      time: 1
    },
    {
      title: '两小时久坐提醒',
      text: '每隔 120 分钟，提醒喝水 1 次',
      time: 120
    }
  ]
}
</script>

<style scoped lang="scss">
.strengthBackground {
  width: 100vw;
  height: 100vh;
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgb(14 136 109 / 70%);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
  opacity: 0;
  animation-name: fadeIn;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
