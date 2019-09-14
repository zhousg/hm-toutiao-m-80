import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 完整导入vant  将来上线打包优化 按需导入即可
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'

// rem基准值计算的插件
import 'amfe-flexible'
import '@/styles/index.less'

// 使用自己的插件
import plugin from '@/utils/plugin'

// 注册好了 支持v-lazy指令
Vue.use(Lazyload)

Vue.use(plugin)

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
