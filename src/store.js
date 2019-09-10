import Vue from 'vue'
import Vuex from 'vuex'

import * as auth from '@/utils/auth'

Vue.use(Vuex)
// 通过vuex管理token的目的：共享token,监听到登录状态。
export default new Vuex.Store({
  state: {
    // 申明 用户信息数据  其他组件共享
    user: auth.getUser()
  },
  mutations: {
    // 修改 用户信息数据
    setUser (state, user) {
      // 更新 vuex的user数据
      state.user = user
      // 更新 本地存储user数据
      auth.setUser(user)
    },
    // 删除  用户信息数据
    delUser (state) {
      // 更新 vuex的user数据
      state.user = {}
      // 更新 本地存储user数据
      auth.delUser()
    }
  },
  actions: {

  }
})
