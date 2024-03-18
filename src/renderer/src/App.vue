<script setup lang="ts">
import icon from '../../../resources/icon.png'
const close = () => {
  window.electronAPI.windowClose()
}
const minimize = () => {
  window.electronAPI.windowMini()
}
</script>

<template>
  <div class="container">
    <header class="header">
      <div class="logo">
        <img :src="icon">
        <span>星璘健康</span>
      </div>
      <div class="header-button">
        <button @click="close">
          <span>*</span>
        </button>
        <button @click="minimize">
          <span>-</span>
        </button>
        <button @click="close">
          <span>x</span>
        </button>
      </div>
    </header>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 480px;
  height: 400px;
}

.header {
  height: 30px;
  width: 100%;
  background-color: rgba(46, 46, 56, 0.8);
  -webkit-app-region: drag;
  user-select: none;
  -webkit-user-select: none;
  display: flex;
  justify-content: space-between;

  .logo {
    display: flex;

    img {
      display: block;
      width: 20px;
      height: 20px;
      margin: 5px 2px;
    }

    span {
      font-size: 12px;
      line-height: 28px;
      color: rgba(217, 217, 255, 0.55);
    }
  }

  .header-button {
    margin-right: 6px;
    button {
      all: unset;
      width: 30px;
      height: 20px;
      line-height: 20px;
      -webkit-app-region: no-drag;
      text-align: center;
      color: rgba(217, 217, 255, 0.55);
      margin-top: 5px;
      border-radius: 2px;
      transition: all 140ms;
      &:hover {
        background-color: rgba(217, 217, 255, 0.2);
      }
    }
  }
}
</style>