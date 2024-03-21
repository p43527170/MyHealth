<template>
  <section v-if="name && name != 'qita'" class="reminder-container">
    <div class="mode-settings" :style="{ flex: name == 'heshui' ? 4 : 2 }">
      <div v-for="(item, index) in modeData[name]" :key="index" class="mode-button"
        :class="active == index ? 'active' : ''" @click="changeMode(index)">
        <span class="mode-title">{{ item.title }}</span>
        <span class="mode-text">{{ item.text }}</span>
      </div>
    </div>
    <div class="reminder-settings">
      <span class="title">声音</span>
      <div class="setting-button">
        <el-switch v-model="data.voiceValue" style="--el-switch-on-color: #e9ad4d"
          @change="(value: boolean) => dataStore.updateReminder(dataIndex, 'voiceValue', value)"
          />
      </div>
    </div>
    <div class="reminder-settings">
      <span class="title">强度</span>
      <div class="setting-button">
        <el-radio-group name="strength" v-model="data.strengthValue"
          style="--el-color-primary: #e9ad4d; flex-direction: column; width: 194px; display: block"
          @change="(value: number) => dataStore.updateReminder(dataIndex, 'strengthValue', value)">
          >
          <el-radio :value="0">弱提醒 (右下角气泡提醒)</el-radio>
          <el-radio :value="1">中提醒 (屏幕上方气泡提醒)</el-radio>
          <el-radio :value="2">强提醒 (遮挡屏幕强制休息)</el-radio>
        </el-radio-group>
      </div>
    </div>
  </section>
  <section v-else>
    <span>有空再写</span>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDataStore } from '@renderer/store/dataStore'
const dataStore = useDataStore()
const route = useRoute()
const name = route.query.name as string
const dataIndex = route.query.dataIndex as unknown as number

const modeData = dataStore.reminderSettings
const data = ref(dataStore.appData[dataIndex])

const active = ref(data.value.modeValue)
const changeMode = (value: number) => {
  active.value = value
  dataStore.updateReminder(dataIndex, 'modeValue', value)
}
</script>

<style scoped lang="scss">
.reminder-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: calc(100% - 30px);
  width: 100%;

  .mode-settings {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
    padding-bottom: 0;

    .mode-button.active {
      background: linear-gradient(90deg, #e9ad4d 0%, #d38327 100%);
      border: none;
      color: #fff;
    }

    .mode-button {
      width: 100%;
      border-radius: 8px;
      flex: 1;
      display: flex;
      justify-content: space-between;
      text-align: center;
      border: 1px solid rgba(255, 212, 147, 0.4);
      color: rgba(255, 212, 147, 0.9);
      align-items: center;
      margin-bottom: 16px;
      padding: 0px 16px;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;

      .mode-title {
        display: block;
        font-size: 14px;
        line-height: 1;
        font-weight: bold;
      }

      .mode-text {
        display: block;
        font-size: 12px;
        line-height: 1;
      }
    }
  }

  .reminder-settings {
    flex: 1;
    border-top: 1px solid #6f6b773d;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    color: #ffd28e;
  }
}
</style>
