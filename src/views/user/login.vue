<template>
  <div class="page-user-chat">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登录"></van-nav-bar>
    <van-cell-group>
      <van-field label="手机号" @blur="checkMobile" v-model.trim="loginForm.mobile" :error-message="errMsg.mobile" placeholder="请输入手机号" />
      <van-field label="验证码" @blur="checkCode" v-model.trim="loginForm.code" :error-message="errMsg.code" placeholder="请输入验证码">
        <van-button class="p5" slot="button" size="mini" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
        <van-button type="info" @click="login" block round>登 录</van-button>
    </div>
  </div>
</template>

<script>
// error-message底部错误提示文案，为空时不展示
// 1. 动态绑定 错误数据
// 2. 动态绑定 表单元素的数据
// 3. 监听失去焦点事件  获取当前表单元素的数据 进行校验
// 如果错误，给错误数据复制，如果成功，清除错误数据
// 4. 点击登录的时候，全部表单元素校验一次
// 如果没有错误信息认为 校验成功  如果有一项代表没有成功
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'user-login',
  data () {
    return {
      // 错误提示
      errMsg: {
        mobile: '',
        code: ''
      },
      // 表单数据
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {
    checkMobile () {
      // 校验手机号
      // 1. 非空
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '请输入手机号'
        return false
      }
      // 2. 格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '手机号格式错误'
        return false
      }
      this.errMsg.mobile = ''
    },
    checkCode () {
      // 校验验证码
      // 1. 非空
      if (!this.loginForm.code) {
        this.errMsg.code = '请输入验证码'
        return false
      }
      // 2. 格式
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '验证码为6个数字'
        return false
      }
      this.errMsg.code = ''
    },
    ...mapMutations(['setUser']),
    async login () {
      // 整个表单进行校验
      this.checkMobile()
      this.checkCode()
      // 判断校验结果
      if (this.errMsg.mobile || this.errMsg.code) {
        // 校验失败
        return false
      }
      try {
        // 校验成功  （进行登录）
        const data = await login(this.loginForm)
        // 登录成功
        // 1. 提示
        this.$toast({ type: 'success', message: '登录成功' })
        // 2. 保存token
        this.setUser(data)
        // 3. 根据地址栏是否有回跳的地址  如果有 回调即可  如果没  个人中心 /user
        const url = this.$route.query.redirect || '/user'
        this.$router.push(url)
      } catch (e) {
        // 4. 错误提示
        this.$toast({ type: 'fail', message: '登录失败' })
      }
    }
  }
}
</script>

<style scoped lang='less'>
.p5{
  padding: 0 5px;
}
.btn_box{
  padding: 10px;
  .van-button{
    height: 32px;
    line-height: 30px;
  }
}
</style>
