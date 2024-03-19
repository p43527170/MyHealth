<script setup lang="ts">
import { ref } from 'vue'
import BigButton from './components/BigButton.vue'
import heshui from './image/heshui.png'
import jiuzuo from './image/jiuzuo.png'
import yanjing from './image/yanjing.png'
import qita from './image/qita.png'

const buttonData = ref([
  {
    title: '护眼提醒',
    mode: '20-20-20 护眼法',
    voice: '关',
    strength: '中',
    url: 'https://www.baidu.com',
    switch: true,
    icon: yanjing,
    other: false
  },
  {
    title: '久坐提醒',
    mode: '一小时久坐提醒',
    voice: '关',
    strength: '低',
    url: 'https://www.baidu.com',
    switch: true,
    icon: jiuzuo,
    other: false
  },
  {
    title: '喝水提醒',
    mode: '1小时喝水提醒',
    voice: '关',
    strength: '中',
    url: 'https://www.baidu.com',
    switch: false,
    icon: heshui,
    other: false
  },
  {
    title: '自定义提醒',
    allocation: 0,
    startup: 0,
    url: 'https://www.baidu.com',
    icon: qita,
    other: true
  }
])

//主进程最小化
const windowMinimize = () => {
  window.electronApi.minimize()
}
//主进程关闭
const windowClose = () => {
  window.electronApi.close()
}

//切换开关
const clickSwitch = (index) => {
  buttonData[index].switch = !buttonData[index].switch
}
</script>
<template>
  <div class="container">
    <header class="header">
      <div class="logo">
        <img src="./image/logobai.png" alt="logo" />
        <span class="title">星璘健康</span>
      </div>
      <section class="window-buttons">
        <button class="button" @click="windowMinimize">
          <el-icon size="14">
            <iEpTools />
          </el-icon>
        </button>
        <button class="button" @click="windowMinimize">
          <el-icon size="14">
            <iEpSemiSelect />
          </el-icon>
        </button>
        <button class="button" @click="windowClose">
          <el-icon size="14">
            <iEpCloseBold />
          </el-icon>
        </button>
      </section>
    </header>
    <article class="content">
      <section v-for="(item, index) in buttonData" :key="index" class="button-ctn">
        <BigButton :button-data="item" @click-switch="clickSwitch(index)" />
      </section>
    </article>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  justify-content: space-evenly;
  height: 400px;
  display: flex;
  flex-wrap: wrap;

  .header {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
    background: rgba(50, 51, 65, 0.75);
    //可拖拽
    -webkit-app-region: drag;
    //不可选中文字
    user-select: none;
    -webkit-user-select: none;
    color: rgba(219, 221, 255, 0.6);

    .logo {
      display: flex;

      img {
        width: 22px;
        height: 22px;
        display: block;
        margin-top: 4px;
        margin-right: 4px;
      }

      span {
        font-size: 12px;
        line-height: 28px;
      }
    }

    .window-buttons {
      margin-top: 5px;
      display: flex;

      .button {
        all: unset;
        box-sizing: border-box;
        padding-top: 2px;
        cursor: pointer;
        border-radius: 2px;
        font-size: 12px;
        line-height: 20px;
        width: 20px;
        height: 20px;
        text-align: center;
        //允许点击事件
        -webkit-app-region: no-drag;
        transition: all 140ms;
        margin-left: 4px;

        &:hover {
          background-color: rgba(219, 221, 255, 0.2);
        }
      }
    }
  }

  .content {
    height: calc(100% - 30px);
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 16px;
    padding-bottom: 0;

    .button-ctn {
      width: 48%;
      margin-bottom: 16px;
    }
  }
}
</style>
