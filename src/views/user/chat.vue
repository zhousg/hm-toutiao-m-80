<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="list">
      <div class="chat-item" :class="{left:item.name==='xz',right:item.name==='zj'}" v-for="(item,i) in list" :key="i">
        <van-image v-if="item.name==='xz'" fit="cover" round :src="xzAvatar" />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image v-if="item.name==='zj'" fit="cover" round :src="zjAvatar" />
      </div>
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="说点什么...">
        <van-loading v-if="sending" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import xzAvatar from '../../assets/images/xz.png'
import io from 'socket.io-client'
import { mapState } from 'vuex'
export default {
  name: 'user-chat',
  data () {
    return {
      sending: false,
      value: '',
      // 消息列表  [{name:'xz',msg:''},{name:'zj',msg:''}]
      list: [],
      xzAvatar,
      zjAvatar: this.$route.query.photo
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    // 创建链接
    this.socket = io('http://ttapi.research.itcast.cn', {
      token: this.user.token
    })
    this.socket.on('connect', () => {
      // 默认让小智发消息  欢迎消息
      this.list.push({ name: 'xz', msg: '您想知道点什么呢？' })
    })
    // 收消息
    this.socket.on('message', (data) => {
      // 记录list
      this.list.push({ name: 'xz', msg: data.msg })
      this.scrollBottom()
    })
  },
  methods: {
    send () {
      if (!this.value) return false
      // 发消息
      this.socket.emit('message', { msg: this.value, timestamp: Date.now() })
      // 记录消息
      this.list.push({ name: 'zj', msg: this.value })
      this.value = ''
      this.scrollBottom()
    },
    scrollBottom () {
      this.$nextTick(() => {
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight
      })
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
