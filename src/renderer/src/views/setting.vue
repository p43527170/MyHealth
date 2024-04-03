<template>
  <div class="setting-container">
    <div class="setting-ctn">
      <span>开机启动</span>
      <div>
        <el-checkbox :checked="setting.powerOn" @change="(newValue) => dataStore.toggleSetting('powerOn', newValue)" />
      </div>
    </div>
    <!-- <div class="setting-ctn">
      <span>同频率提醒合并</span>
      <div>
        <el-checkbox
          v-model="setting.merge"
          @change="(newValue) => dataStore.toggleSetting('merge', newValue)"
        />
      </div>
    </div> -->
    <div class="setting-ctn">
      <span>自动升级</span>
      <div>
        <el-checkbox v-model="setting.automaticUpgrade" @change="(newValue) => dataStore.toggleSetting('automaticUpgrade', newValue)" />
      </div>
    </div>
    <div class="setting-ctn">
      <span>清理缓存文件(保留个人设置)</span>
      <el-link type="primary" :underline="false" @click="resetData">清理</el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDataStore } from '@renderer/store/dataStore'
const dataStore = useDataStore()
const setting = ref(dataStore.setting)

const resetData = () => {
  window.electron.ipcRenderer.invoke('clear-all-data-and-cache')
}
</script>

<style scoped lang="scss">
.setting-container {
  width: 100%;
  height: 100%;
  padding: 16px;

  .setting-ctn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;

    span {
      font-size: 14px;
    }
  }
}
</style>
