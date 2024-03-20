<template>
  <div v-if="!!localData && !!localData.icon" class="button" @click="clickRouter">
    <div class="title">
      <img :src="localData.icon.value as unknown as string" alt="" />
      <span>{{ localData.title.value }}</span>
    </div>
    <div v-if="!localData.other.value" class="content">
      <p>
        模式：<span>{{ localData.mode?.value }}</span>
      </p>
      <p>
        声音：<span>{{ localData.voice?.value }}</span>
      </p>
      <p>
        强度：<span>{{ localData.strength?.value }}</span>
      </p>
      <div @click="toggleSwitch">
        <el-switch
          v-if="localData.switch"
          v-model="localData.switch.value"
          style="--el-switch-on-color: #ff9bc4"
          @change="clickHandle"
        />
      </div>
    </div>
    <div v-if="localData.other.value" class="content">
      <p>
        已配置：<span>{{ localData.allocation?.value }}</span>
      </p>
      <p>
        已启用：<span>{{ localData.startup?.value }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

interface Iprops {
  buttonData: {
    icon: string
    title: string
    url: string
    other: boolean
    mode?: string
    voice?: string
    strength?: string
    switch?: boolean
    allocation?: number
    startup?: number
  }
}
const props = defineProps<Iprops>()
const localData = toRefs(props.buttonData)

const emits = defineEmits(['clickSwitch'])

//点击clickSwitch向父组件传参
const clickHandle = (value) => {
  emits('clickSwitch', value)
}
function toggleSwitch(event) {
  // 阻止事件冒泡到父元素，避免触发页面跳转
  event.stopPropagation()
}
const clickRouter = () => {
  //点击切换路由router跳转
  router.push({
    name: 'ReminderSettings',
    query: {
      id: localData.url.value
    }
  })
}
</script>

<style scoped lang="scss">
.button {
  //背景色渐变半透明
  background: linear-gradient(135deg, rgba(70, 71, 88, 0.5) 0%, rgba(79, 85, 99, 0.6) 100%);
  border-radius: 8px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 18px 0 rgba(131, 122, 143, 0.2);
  cursor: pointer;
  transition: background 0.24s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(70, 71, 88, 0.6) 0%, rgba(79, 85, 99, 0.7) 100%);
  }

  .title {
    display: flex;
    padding: 10px 16px;

    // border-bottom: 1px solid #515158;
    // justify-content: center;
    img {
      width: 26px;
      height: 26px;
      margin-right: 8px;
      background-color: #ffffff;
      border-radius: 50%;
      padding: 4px;
    }

    span {
      font-size: 16px;
      color: #a1a4bd;
      line-height: 26px;
      font-weight: 600;
    }
  }

  .content {
    padding: 6px 16px;
    font-size: 14px;
    color: #a1a4bd;

    span {
      color: #ffffff;
    }
  }
}
</style>
