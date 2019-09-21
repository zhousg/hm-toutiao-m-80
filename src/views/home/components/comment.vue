<template>
  <div class="comment">
    <!-- 评论列表 -->
    <van-list :immediate-check="false" @load="getComments()" v-model="loading" :finished="finished" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
        <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
        <div class="info">
          <p>
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{item.like_count}}</span>
            </span>
          </p>
          <p>{{item.content}}</p>
          <p>
            <span class="time">{{item.pubdate|relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(item.com_id)">{{item.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 底部输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px">
        </van-loading>
        <span class="submit" v-else slot="button" @click="submit()">提交</span>
      </van-field>
    </div>
    <!-- 回复 -->
    <van-action-sheet v-model="showReply" class="reply_dailog" title="回复评论" @closed="reply.commentId=null">
      <van-list :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{item.aut_name}}</span></p>
            <p>{{item.content}}</p>
            <p><span class="time">{{item.pubdate|relTime}}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
</template>

<script>

// 渲染评论列表
// 1.1 什么时候获取数据，组件激活的时候。
// 1.2. van-list组件的load事件，组件初始化会触发。
// 1.3. 不会使用van-list组件的默认第一次加载，由自己来控制。
// 1.4. 关闭van-list组件默认第一次加载 :immediate-check="false"
// 2. 先获取文章的ID   地址栏  this.$route.params.id
// 3. 封装API  article.js
// 4. 调用API  组件激活的时候
// 5. 获取数据 进行渲染
import { getComments, commentOrReply } from '@/api/article'
export default {
  name: 'article-comment',
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 偏移量
      offset: null,
      // 评论列表
      comments: [],
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      // ------------ 回复相关数据 -------------
      // 控制回复弹窗显示隐藏
      showReply: false,
      reply: {
        // 当前正在回复的评论ID
        commentId: null,
        // 上拉加载中
        loading: false,
        // 全部加载完毕
        finished: false,
        // 偏移量
        offset: null,
        // 回复列表
        list: []
      }
    }
  },
  activated () {
    // 注意：每次激活组件，获取最新评论。
    // 开启加载效果
    this.loading = true
    // 重置数据
    this.comments = []
    // 重置完全加载
    this.finished = false
    // 修改offset
    this.offset = null
    // 获取数据
    this.getComments()
  },
  methods: {
    // 提交 评论与回复
    async submit () {
      // 没有输入内容
      if (!this.value) return false
      // 开启提交中
      this.submiting = true
      await this.$sleep()
      if (this.reply.commentId) {
        // 回复
        const data = await commentOrReply(this.reply.commentId, this.value, this.$route.params.id)
        // 在回复列表顶部追加  回复信息
        this.reply.list.unshift(data.new_obj)
        // 找到当前回复的评论，把数据加一即可
        const comment = this.comments.find(item => item.com_id === this.reply.commentId)
        comment.reply_count++
        // 清除输入框
        this.value = ''
        // 结束提交中
        this.submiting = false
      } else {
        // 评论
        const data = await commentOrReply(this.$route.params.id, this.value)
        this.comments.unshift(data.new_obj)
        // 清除输入框
        this.value = ''
        // 结束提交中
        this.submiting = false
      }
    },
    // 打开回复
    openReply (id) {
      this.showReply = true
      this.reply.commentId = id
      // 重置数据
      this.reply.finished = false
      this.reply.loading = true
      this.reply.list = []
      this.reply.offset = null
      this.getReplys()
    },
    // 获取回复
    async getReplys () {
      await this.$sleep()
      const data = await getComments(this.reply.commentId.toString(), 'c', this.reply.offset)
      this.reply.list.push(...data.results)
      // 处理加载中状态
      this.reply.loading = false
      // 判断是否有数据
      if (data.end_id < data.last_id) {
        // 有数据  把offset改为最后一个ID
        this.reply.offset = data.last_id
      } else {
        // 没数据  改成加载完毕
        this.reply.finished = true
      }
    },
    // 获取评论
    async getComments () {
      await this.$sleep()
      const data = await getComments(this.$route.params.id, 'a', this.offset)
      this.comments.push(...data.results)
      // 处理加载中状态
      this.loading = false
      // 判断是否有数据
      if (data.end_id < data.last_id) {
        // 有数据  把offset改为最后一个ID
        this.offset = data.last_id
      } else {
        // 没数据  改成加载完毕
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
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
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
.reply_dailog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
