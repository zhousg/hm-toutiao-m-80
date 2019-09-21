<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <van-search v-model.trim="q" placeholder="请输入搜索关键词" shape="round" @search="onSearch"/>
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell @click="onSearch(sug.replace(`<span>${q}</span>`,q))" icon="search" v-for="sug in suggestList" :key="sug"><p v-html="sug"></p></van-cell>
    </van-cell-group>
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="clearHistory()"></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for="item in historyList" :key="item">
          <a @click="toSearch(item)" class="word_btn">{{item}}</a>
          <van-icon @click="delHistory(item)" class="close_btn" slot="right-icon" name="cross"/>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { suggest } from '@/api/article'
// 使用本地存储来记录历史搜索
// 约定：key = 'hm-toutiao-m-80-history'
// 约定：value 数据格式  ['曾经搜索过的关键字',...]
const KEY = 'hm-toutiao-m-80-history'
export default {
  name: 'search-index',
  data () {
    return {
      // 搜索关键字
      q: '',
      // 历史搜索记录
      historyList: [],
      // 定时器 ID
      timer: null,
      // 联想词条
      suggestList: []
    }
  },
  created () {
    this.historyList = JSON.parse(window.localStorage.getItem(KEY) || '[]')
  },
  // 进行联想搜索  获取建议词条
  // 1. 当输入的内容发生改变的时候，根据输入的内容获取建议的词条。
  // 2. 使用组件的事件 input 事件监听，再去获取。
  // 3. 使用watch来监听 q 数据的变化， 输入的内容发生改变。
  // 4. 什么时候发请求：规定一个时间，假设200ms,在内容改变有的200ms后才发请求，
  // 如果在200ms内又发生数据的改变，停止发送请求，200ms后才发送。
  // 5. 函数防抖：在规定时间内，再次执行，清除上一次执行，重新执行。
  // 5.1 运用场景：搜索提示，在开销较大操作需要频繁执行的时候（页面尺寸改变，滚动条滚动）
  // 6. 函数节流：在规定时间内，再次执行，必须等上一次执行完毕，才能执行。
  // 6.1 运用场景: 轮播图
  watch: {
    q () {
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(async () => {
        if (!this.q) {
          // 清空搜索联想词条
          this.suggestList = []
          return false
        }
        const data = await suggest(this.q)
        this.suggestList = data.options.map(item => item.toLowerCase().replace(this.q, `<span>${this.q}</span>`))
      }, 200)
    }
  },
  methods: {
    // 清空
    clearHistory () {
      this.historyList = []
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    },
    // 删除
    delHistory (text) {
      const index = this.historyList.findIndex(item => item === text)
      this.historyList.splice(index, 1)
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    },
    toSearch (text) {
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    // 搜索
    onSearch (text) {
      // 搜索时候触发：
      // 1. PC端  当你按下 回车  触发这个函数
      // 2. 移动端  当前你按下虚拟键盘中的enter按钮触发，部分手机虚拟键盘中 搜索 确认 按钮。

      if (!text) return false
      // 保存 输入的内容 text
      // this.historyList.push(text)
      // window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
      // 搜索相同内容的时候，不能存入进去。 数组去重。
      // ES6的 Set  是构造函数  const set = new Set(数组)  set是一个集合，不能拥护重复数据
      const set = new Set(this.historyList)
      set.add(text)
      // 转换成数组 赋值给 historyList
      this.historyList = Array.from(set)
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
      // 跳转搜索结果页面
      this.$router.push({ path: '/search/result', query: { q: text } })
    }
  }
}
</script>

<style scoped lang='less'>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
