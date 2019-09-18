<template>
  <van-popup :value="value" @input="$emit('input',$event)" @closed="isReport=false">
    <van-cell-group v-if="!isReport">
      <van-cell @click="disLikes()">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell @click="report(item.value)" v-for="item in reportType" :key="item.value">{{item.label}}</van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
import { disLikes, report } from '@/api/article'
import { reportType } from '@/api/constants'
export default {
  props: {
    // 其实就是 showMoreAction 的值
    value: {
      type: Boolean,
      default: false
    },
    // 接收 父组件 点的文章ID
    // 超出安全数值 类型对象  没有超出 类型数字
    // 统一是字符串  当然使用多种数据类型
    articleId: {
      type: [Object, Number],
      default: null
    }
  },
  data () {
    return {
      // 是不是在做举报
      isReport: false,
      reportType
    }
  },
  methods: {
    // 举报文章
    async report (type) {
      try {
        await report(this.articleId, type)
        // 处理成功
        // 1. 提示
        this.$toast({ type: 'success', message: '操作成功' })
        // 2. 关闭 更多操作 组件
        this.$emit('input', false)
        // 3. 移除 父组件 对应的文章
        this.$emit('on-report')
      } catch (e) {
        // 判断 状态码 409 简单提示 ‘文章已举报’
        if (e.response.status === 409) {
          this.$toast('文章已举报')
        } else {
          this.$toast({ type: 'fail', message: '操作失败' })
        }
      }
    },
    // 不喜欢文章
    async disLikes () {
      try {
        // 1. 获取当前点击的文章ID
        // console.log(this.articleId)
        // 2. 发出  不感兴趣  的请求
        await disLikes(this.articleId)
        // 3. 如果成功，提示 操作成功
        this.$toast({ type: 'success', message: '操作成功' })
        // 4. 关闭当前的对话框
        this.$emit('input', false)
        // 5. 通知  父组件  删除当前点击的文章
        this.$emit('on-dislikes')
      } catch (e) {
        this.$toast({ type: 'fail', message: '操作失败' })
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
