import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
//导入路由模块
import router from './router'
import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
