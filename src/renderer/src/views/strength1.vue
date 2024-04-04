<template>
  <div class="strengthBackground" @dblclick="close">
    <div class="strengthCtn">
      <div class="image">
        <img :src="selectImage" alt="" />
      </div>
      <div class="text">
        <h4>{{ title }}</h4>
        <h5>
          {{ text }}
          <span v-if="index === 0 || index === 1"> {{ num }} 秒</span>
        </h5>
      </div>
    </div>
    <span class="tip">（双击或按ESC键关闭）</span>
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
//关闭方法
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
  background: rgb(22 170 137 / 70%);
  border-radius: 6px;
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
  opacity: 0;
  animation-name: fadeIn;

  .strengthCtn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 12px;

    .image {
      background-color: rgb(255 255 255 / 90%);
      width: 48px;
      border-radius: 20px;
      padding: 4px;

      img {
        width: 100%;
        display: block;
      }
    }

    .text {
      color: #ffffff;
      text-align: left;
      padding: 4px 0;

      h4 {
        font-size: 20px;
        line-height: 1.4;
      }

      h5 {
        font-size: 16px;
      }
    }
  }

  .tip {
    font-size: 12px;
    display: block;
    text-align: center;
    line-height: 20px;
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
