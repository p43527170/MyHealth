<template>
  <div class="setting-container">
    <div class="setting-ctn">
      <span>开机启动</span>
      <div>
        <el-checkbox
          v-model="setting.powerOn"
          @change="dataStore.toggleSetting('powerOn')"
        />
      </div>
    </div>
    <div class="setting-ctn">
      <span>同频率提醒合并</span>
      <div>
        <el-checkbox
          v-model="setting.merge"
          @change="dataStore.toggleSetting('merge')"
        />
      </div>
    </div>
    <div class="setting-ctn">
      <span>开启悬浮窗</span>
      <div>
        <el-checkbox
          v-model="setting.floatingWindow"
          @change="dataStore.toggleSetting('floatingWindow')"
        />
      </div>
    </div>
    <div class="setting-ctn">
      <span>自动升级</span>
      <div>
        <el-checkbox
          v-model="setting.automaticUpgrade"
          @change="dataStore.toggleSetting('automaticUpgrade')"
        />
      </div>
    </div>
    <div class="setting-ctn">
      <span>重置所有设置</span>
      <el-link type="primary" :underline="false">重置</el-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDataStore } from '@renderer/store/dataStore'
const dataStore = useDataStore()
console.log(dataStore.setting)
const setting = ref(dataStore.setting)
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
