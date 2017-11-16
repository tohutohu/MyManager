// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import store from '@/store/index.js'
import App from './App'
import router from './router'
import {Notification} from 'element-ui'
import 'element-ui/lib/theme-default/notification.css'
import 'element-ui/lib/theme-default/base.css'
import 'vuetify/dist/vuetify.min.css'
import aaxios from 'axios'
const axios = aaxios.create({
  withCredentials: true
})
const moment = require('moment')
require('moment/locale/ja')

Vue.config.productionTip = false
Vue.prototype.$notify = Notification
Vue.prototype.$axios = axios
Vue.prototype.$moment = moment
Vue.use(Vuetify)
Vue.use(store)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
})
