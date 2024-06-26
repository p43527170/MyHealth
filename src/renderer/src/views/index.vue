<template>
  <div class="container">
    <header class="header">
      <div class="myLogo">
        <img src="../image/logobai.png" alt="logo" />
        <span class="title">星璘健康</span>
      </div>
      <section class="window-buttons">
        <button v-show="!isHomeRoute" class="button" @click="goBack">
          <el-icon size="14">
            <iEpArrowLeftBold />
          </el-icon>
        </button>
        <button class="button" @click="goSetting">
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
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@renderer/store/dataStore'
const router = useRouter()

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

window.electron.ipcRenderer.on('toSetting', () => {
  console.log('toSetting')
  router.push('/setting')
})

//goBack返回上一页
const goBack = () => {
  router.back()
}
//主进程最小化
const windowMinimize = () => {
  window.electron.ipcRenderer.invoke('minimize')
}
//主进程关闭
const windowClose = () => {
  window.electron.ipcRenderer.invoke('close')
}
const isHomeRoute = computed(() => {
  return (
    router.currentRoute.value.name === 'Home' ||
    router.currentRoute.value.path === '/home'
  )
})
//goSetting跳转设置页
const goSetting = () => {
  router.push('/setting')
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  justify-content: space-evenly;
  height: 400px;
  display: flex;
  flex-wrap: wrap;
  background: var(--color-background);
  background-image: url('../assets/wavy-lines.svg');
  background-size: cover;

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

    .myLogo {
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
}
</style>