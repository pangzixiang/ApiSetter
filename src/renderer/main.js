import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import Form from 'ant-design-vue'
Vue.use(Form)

import Layout from "ant-design-vue/lib/layout";
Vue.use(Layout)

import Menu from "ant-design-vue";
Vue.use(Menu)

import Select from "ant-design-vue";
Vue.use(Select)

import Spin from "ant-design-vue/lib/spin/Spin";
Vue.use(Spin)

import 'ant-design-vue/dist/antd.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

