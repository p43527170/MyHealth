import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '../views/index.vue'
const routes = [
  {
    path: '/',
    component: Index,
    name: 'Index',
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () =>
          import(/* webpackChunkName: "home" */ '../views/home.vue'),
        name: 'Home'
      },
      {
        path: '/reminderSettings',
        component: () =>
          import(
            /* webpackChunkName: "reminder-settings" */ '../views/reminderSettings.vue'
          ),
        name: 'ReminderSettings'
      },
      {
        path: '/setting',
        component: () =>
          import(/* webpackChunkName: "setting" */ '../views/setting.vue'),
        name: 'Setting'
      }
    ]
  },
  {
    path: '/strength1',
    component: () =>
      import(/* webpackChunkName: "stremgtj1" */ '../views/strength1.vue'),
    name: 'Strength1'
  },
  {
    path: '/strength2',
    component: () =>
      import(/* webpackChunkName: "stremgtj2" */ '../views/strength2.vue'),
    name: 'Strength2'
  }
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes
})

export default router
