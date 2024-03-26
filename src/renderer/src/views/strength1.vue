<template>
  <div class="strengthBackground" @dblclick="close">
    <div class="image"><img :src="selectImage" alt="" /></div>
    <div class="text">
      <h4>{{ info.title }}</h4>
      <h5>{{ text }} <span v-if="index === 0 || index === 1"> {{ num }} 秒</span></h5>
      <!-- <h6>双击关闭</h6> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import yanjing from '../image/yanjing.png'
import jiuzuo from '../image/jiuzuo.png'
import heshui from '../image/heshui.png'
import qita from '../image/qita.png'

const images = [yanjing, jiuzuo, heshui, qita]
const selectImage = ref('')
const info = ref({})
const text = ref('')
const num = ref(20)
const index = ref(0)
window.electron.ipcRenderer.on('getStrength12Info', (_event, value) => {
  info.value = value
  selectImage.value = images[value.index]
  text.value = reminderSettings[value.url][value.modeValue].text
  num.value = reminderSettings[value.url][value.modeValue].time
  index.value = value.index
  console.log(text.value)
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
let intervalId
// 每秒减少1的定时器函数
const decreaseNum = () => {
  num.value--
  // 当num值为0时，清除定时器
  if (num.value === 0) {
    clearInterval(intervalId)
    // close()
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
      text: `请向 20 英尺（6米）外眺望`,
      time: 20
    },
    {
      title: '一小时护眼法',
      text: `请闭眼或眺望远方`,
      time: 60
    }
  ],
  jiuzuo: [
    {
      title: '一小时久坐提醒',
      text: `一小时啦，请起身活动一下`,
      time: 30
    },
    {
      title: '两小时久坐提醒',
      text: `两小时啦，请起身活动一下`,
      time: 30
    }
  ],
  heshui: [
    {
      title: '半小时喝水提醒',
      text: '半小时啦，记得喝水',
      time: 6
    },
    {
      title: '一小时久坐提醒',
      text: '一小时啦，记得喝水',
      time: 6
    },
    {
      title: '两小时久坐提醒',
      text: '两小时啦，记得喝水',
      time: 6
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
  background: rgb(22 170 137 / 70%);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
  opacity: 0;
  animation-name: fadeIn;
  .image{
    background-color: rgb(255 255 255 / 90%);
    width: 48px;
    border-radius: 20px;
    padding: 4px;
    img{
      width: 100%;
      display: block;
    }
  }
  .text{
    color: #ffffff;
    text-align: left;
    h4{
      font-size: 20px;
      line-height: 1.4;
    }
    h5{
      font-size: 16px;
    }
  }
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
