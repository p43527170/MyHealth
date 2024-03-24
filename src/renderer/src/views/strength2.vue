<template>
  <div class="strengthBackground" @dblclick="close">
    <div style="text-align: center">
      <h1 style="color: #ffffff">请休息 {{ num }} 秒</h1>
      <p>若想提前结束, 请双击鼠标左键或按ESC</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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
