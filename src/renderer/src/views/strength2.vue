<template>
  <div class="strengthBackground" @dblclick="close">
    <div style="text-align: center">
      <div class="image"><img :src="selectImage" alt="" /></div>
      <h1 style="color: #ffffff">{{ title }}</h1>
      <h3>
        {{ text }} <span v-if="index === 0 || index === 1"> {{ num }} 秒</span>
      </h3>
      <span class="tip">（双击鼠标或按ESC键关闭）</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import yanjing from '../image/yanjing.png'
import jiuzuo from '../image/jiuzuo.png'
import heshui from '../image/heshui.png'
import qita from '../image/qita.png'
import { reminderSettings } from './publicData'

const images = [yanjing, jiuzuo, heshui, qita] //图标组
const selectImage = ref('') //本提示的图标
const title = ref('') //提示标题
const text = ref('') //提示文字
const num = ref(20) //倒计时
const index = ref(0) //提示索引
const name = ref('') //提示名
window.electron.ipcRenderer.on('routerStrength', (_event, newValue) => {
  console.log(newValue);
  const info = reminderSettings[newValue.url] //提示信息
  const modeValue = parseInt(newValue.modeValue)
  selectImage.value = images[newValue.index]
  index.value = parseInt(newValue.index)
  text.value = info[modeValue].text
  num.value = info[modeValue].time
  name.value = newValue.url
  title.value = newValue.title
  console.log(title.value)
})
const close = () => {
  window.electron.ipcRenderer.invoke('closeStrength', name.value)
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
  background: #0e735fba;
  display: flex;
  justify-content: center;
  align-items: center;
  animation-duration: 3s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
  opacity: 0;
  animation-name: fadeIn;
  .image {
    background-color: rgb(255 255 255 / 90%);
    width: 50px;
    border-radius: 20px;
    padding: 4px;
    margin: 0 auto;

    img {
      width: 100%;
      display: block;
    }
  }
  .tip {
    font-size: 12px;
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
