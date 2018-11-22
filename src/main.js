import Vue from 'vue'

import { Container, Header, Main, Menu, MenuItem, Tag, Row, Col, Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'

Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Loading)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Tag)
Vue.use(Row)
Vue.use(Col)

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
