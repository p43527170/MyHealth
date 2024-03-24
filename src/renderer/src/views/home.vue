<template>
  <article class="content">
    <section
      v-for="(item, index) in dataStore.appData"
      :key="index"
      class="button-ctn"
    >
      <BigButton :app-data="item" :index="index" />
    </section>
  </article>
</template>

<script setup lang="ts">
import BigButton from '../components/BigButton.vue'
import { useDataStore } from '../store/dataStore'
const dataStore = useDataStore()
</script>

<style scoped>
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
</style>
