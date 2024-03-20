<template>
  <section v-if="id && id != 'qita'" class="reminder-container">
    <div class="mode-settings" :style="{ flex: id == 'heshui' ? 4 : 2 }">
      <div
        v-for="(item, index) in data[id]"
        :key="index"
        class="mode-button"
        :class="active == index ? 'active' : ''"
        @click="changeMode(index)"
      >
        <span class="mode-title">{{ item.title }}</span>
        <span class="mode-text">{{ item.text }}</span>
      </div>
    </div>
    <div class="reminder-settings">
      <span class="title">声音</span>
      <div class="setting-button">
        <el-switch
          v-model="vocalValue"
          :active-value="true"
          :inactive-value="false"
          style="--el-switch-on-color: #e9ad4d"
        ></el-switch>
      </div>
    </div>
    <div class="reminder-settings">
      <span class="title">强度</span>
      <div class="setting-button">
        <el-radio-group
          v-model="strengthValue"
          style="--el-color-primary: #e9ad4d; flex-direction: column; width: 194px; display: block"
          @change="changeStrength"
        >
          <el-radio value="1">弱提醒 (右下角气泡提醒)</el-radio>
          <el-radio value="2">中提醒 (屏幕上方气泡提醒)</el-radio>
          <el-radio value="3">强提醒 (遮挡屏幕强制休息)</el-radio>
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

const route = useRoute()
const id = route.query.id as string
const data = {
  yanjing: [
    {
      title: '20-20-20 护眼法',
      text: '持续用眼 20 分钟，向 20 英尺外眺望 20 秒'
    },
    {
      title: '一小时护眼法',
      text: '持续用眼 1 小时， 闭眼或眺望远方 1 ~ 5 分钟'
    }
  ],
  jiuzuo: [
    {
      title: '一小时久坐提醒',
      text: '每持续工作 60 分钟，提醒活动 1 分钟'
    },
    {
      title: '两小时久坐提醒',
      text: '每持续工作 120 分钟，提醒活动 1 分钟'
    }
  ],
  heshui: [
    {
      title: '半小时喝水提醒',
      text: '每隔 30 分钟，提醒喝水 1 次'
    },
    {
      title: '一小时久坐提醒',
      text: '每隔 60 分钟，提醒喝水 1 次'
    },
    {
      title: '两小时久坐提醒',
      text: '每隔 120 分钟，提醒喝水 1 次'
    }
  ]
}
const active = ref(0)
const strengthValue = ref('1')
const vocalValue = ref(false)
const changeMode = (e) => {
  active.value = e
}

const changeStrength = (e) => {
  console.log(e)
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
