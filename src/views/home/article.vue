<template>
  <div class='container' ref="container" @scroll="remember($event)">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate|relTime}}</p>
        </div>
        <van-button @click="follow()" round size="small" type="info">{{article.is_followed?'已关注':'+ 关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button round size="small" @click="attitude(1)" :class="{active:article.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" @click="attitude(0)" :class="{active:article.attitude===0}" plain icon="delete">不喜欢</van-button>
      </div>
      <!-- 评论与回复 -->
      <comment></comment>
    </div>
  </div>
</template>

<script>
// 渲染详情
// 1. 需要数据，但是组件做了缓存，created执行一次，需要在activated执行。
// 2. 需要文章的ID，地址栏获取，使用计算属性 获取ID。
// 3. 在article模块 封装接口。

// 阅读记忆
// 1. 记住阅读的位置，申明一个数据，在滚动的时候记录滚动位置。
// 2. 当你再次来到详情组件，且是上一次阅读的文章，滚动到之前的位置。
// 3. 当你再次来到详情组件, 但是新的文章，重置滚动的位置，重新加载数据。

// 关注  当前用户（登录）关注作者
// 1. 记得封装过request.js模块  发送请求后401的处理
// 2. 封装接口  两个  添加关注  取消关注
// 3. 点击按钮  实现两个业务。
// 4. 调用接口的时候 出错误了 并没有阻碍程序运行  需要 return Promise.reject(err)
// 5. 不用使用测试帐号，很多文章自己发布的。自己不能关注自己。

// 点赞与取消点赞  不喜欢与取消不喜欢
// 1. 准备4个接口
// 2. 绑定事件，实现逻辑，一个函数实现，分两种情况，四种逻辑。
import { getArticleDetail, likings, unlikings, disLikes, undisLikes } from '@/api/article'
import { followings, unfollowings } from '@/api/user'
import Comment from './components/comment'
export default {
  name: 'article-index',
  components: { Comment },
  data () {
    return {
      // 文章详情
      article: {},
      // 阅读位置
      scrollTop: 0
    }
  },
  activated () {
    // 激活组件
    // 新ID地址栏ID  String  旧ID article里  Object|Number  进行比较
    if (this.article.art_id && this.articleId === this.article.art_id.toString()) {
      // 同一篇文章
      // 滚动到之前的阅读位置
      this.$refs['container'].scrollTop = this.scrollTop
    } else {
      // 不同的文章
      // 清空之前的文章数据
      this.article = {}
      // 清除滚动的位置
      this.scrollTop = 0
      // 加载数据
      this.getArticleDetail()
    }
  },
  computed: {
    articleId () {
      return this.$route.params.id
    }
  },
  methods: {
    // 改变对文章的态度
    async attitude (type) {
      if (type === 1) {
        if (this.article.attitude === 1) {
          // 取消点赞
          await unlikings(this.articleId)
          // 按钮去掉红色
          this.article.attitude = -1
        } else {
          // 点赞
          await likings(this.articleId)
          // 按钮红色
          this.article.attitude = 1
        }
      } else {
        if (this.article.attitude === 0) {
          // 取消不喜欢
          await undisLikes(this.articleId)
          // 按钮去掉红色
          this.article.attitude = -1
        } else {
          // 不喜欢
          await disLikes(this.articleId)
          // 按钮红色
          this.article.attitude = 0
        }
      }
    },
    // 添加关注 或者 取消关注
    async follow () {
      // 判断现在执行逻辑
      if (this.article.is_followed) {
        // 取消关注
        await unfollowings(this.article.aut_id)
        // 提示
        this.$toast.success('取消关注成功')
        // 更新按钮
        this.article.is_followed = false
      } else {
        // 添加关注
        await followings(this.article.aut_id)
        // 提示
        this.$toast.success('添加关注成功')
        // 更新按钮
        this.article.is_followed = true
      }
    },
    // 记住位置
    remember (e) {
      this.scrollTop = e.target.scrollTop
    },
    // 获取详情
    async getArticleDetail () {
      const data = await getArticleDetail(this.articleId)
      this.article = data
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    // 代码容器  自动换行
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
