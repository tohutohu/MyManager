import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/pages/Top'
import Hitomemo from '@/pages/Hitomemo'
import HitomemoList from '@/pages/HitomemoList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/hitomemo',
      name: 'Hitomemo',
      component: Hitomemo
    },
    {
      path: '/hitomemo/list',
      name: 'HitomemoList',
      component: HitomemoList
    },
    {
      path: '/hitomemo/:id',
      name: 'Hito',
      component: Hitomemo
    }
  ]
})
