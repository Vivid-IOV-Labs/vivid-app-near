// Webpack CSS import
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

import Vue from 'vue'
import VueOnsen from 'vue-onsenui'
Vue.use(VueOnsen)

import VueWebMonetization from 'vuejs-web-monetization'
Vue.use(VueWebMonetization)

import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')