import App from './App'
import vmformComponent from "@/uni_modules/vmform-uni/components/vmform-uni/form-widget/wxComponent.vue";
// import 'default-passive-events'
// #ifndef VUE3
import './composition-api'
import Vue from 'vue'
Vue.component('vmformComponent', vmformComponent)

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'


export function createApp() {
  const app = createSSRApp(App)
  app.component('vmformComponent', vmformComponent)
  return {
    app
  }
}
// #endif
