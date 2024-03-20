import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '../views/index.vue'
const routes = [
  { path: '/', component: Index, name: 'Index' },
  {
    path: '/reminderSettings',
    component: () =>
      import(/* webpackChunkName: "reminder-settings" */ '../views/reminderSettings.vue'),
    name: 'ReminderSettings'
  },
  {
    path: '/setting',
    component: () => import(/* webpackChunkName: "reminder-settings" */ '../views/setting.vue'),
    name: 'Setting'
  }
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes
})

export default router
