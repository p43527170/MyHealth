<script setup lang="ts">
import EyeProtection from './components/Versions.vue'
import Sedentary from './components/Versions.vue'
import DrinkingWater from './components/Versions.vue'
import Other from './components/Versions.vue'
const ipcHandle = () => {
  window.electron.ipcRenderer.send('ping')
}
</script>

<template>
  <div class="actions">
    <EyeProtection />
    <Sedentary />
    <DrinkingWater />
    <Other />
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
  </div>
</template>
