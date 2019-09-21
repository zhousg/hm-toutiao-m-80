<template>
  <div class="container">
    <van-tabs @change="changeChannel" swipeable v-model="activeIndex" :lazy-render="false">
      <van-tab :key="item.id" v-for="item in channels" :title="item.name">
        <!-- 需要滚动条  将来实现阅读记忆功能 -->
        <div ref="scroll-wrapper" class="scroll-wrapper" @scroll="remember($event)">
          <van-pull-refresh
            v-model="activeChannel.downLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
          >
            <van-list
              v-model="activeChannel.upLoading"
              :finished="activeChannel.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell  @click="$router.push('/article/'+article.art_id)" v-for="article in activeChannel.articles" :key="article.art_id.toString()">
                <div class="article_item">
                  <h3 class="van-ellipsis">{{article.title}}</h3>
                  <div class="img_box" v-if="article.cover.type===3">
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[0]" />
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[1]" />
                    <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[2]" />
                  </div>
                  <div class="img_box" v-if="article.cover.type===1">
                    <van-image lazy-load class="w100" fit="cover" :src="article.cover.images[0]" />
                  </div>
                  <div class="info_box">
                    <span>{{article.aut_name}}</span>
                    <span>{{article.comm_count}} 评论</span>
                    <span>{{article.pubdate|relTime}}</span>
                    <span v-if="user.token" class="close" @click="openMoreAction(article.art_id)">
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 显示频道编辑组件 -->
    <span class="bar_btn" @click="showChannelEdit=true" slot="nav-right">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 更多操作组件 -->
    <more-action
      v-if="user.token"
      v-model="showMoreAction"
      :articleId="articleId"
      @on-dislikes="removeArticle()"
      @on-report="removeArticle()"
    ></more-action>
    <!-- 频道编辑组件 -->
    <channel-edit
      v-model="showChannelEdit"
      :channels="channels"
      :activeIndex.sync="activeIndex"
    ></channel-edit>
  </div>
</template>

<script>
import { getMyChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import { mapState } from 'vuex'
import MoreAction from './components/more-action'
import ChannelEdit from './components/channel-edit'
export default {
  name: 'home-index',
  components: { MoreAction, ChannelEdit },
  data () {
    return {
      // 刷新成功的文案
      refreshSuccessText: null,
      // 频道列表
      channels: [],
      // 当前激活的频道索引
      activeIndex: 0,
      // 控制更多操作的显示隐藏
      showMoreAction: false,
      // 当前点击的文章ID
      articleId: null,
      // 控制编辑频道的显示隐藏
      showChannelEdit: false
    }
  },
  computed: {
    // 当前激活的频道
    activeChannel () {
      return this.channels[this.activeIndex]
    },
    // user信息 (登录 退出)
    ...mapState(['user'])
  },
  watch: {
    user () {
      // 登录 退出 触发当前函数
      // 默认选中  推荐频道
      this.activeIndex = 0
      // 重新更新当前组件的频道数据
      this.getMyChannels()
      // 重新获取频道下的文章数据
      this.onLoad()
    }
  },
  activated () {
    // 激活组件触发 第一次初始化也叫激活
    // 获取当前激活的频道下的滚动容器，获取之前记录的阅读位置
    // ref="scroll-wrapper"  遍历后有很多个容器拥有属性 [dom0,dom1,dom2,...]
    const domArr = this.$refs['scroll-wrapper']
    if (domArr) {
      const scrollWrapper = domArr[this.activeIndex]
      const scrollTop = this.activeChannel.scrollTop
      // 设置滚动的容器 的scrollTop属性为阅读位置  即可
      scrollWrapper.scrollTop = scrollTop
    }
  },
  created () {
    this.getMyChannels()
  },
  methods: {
    // 删除文章
    removeArticle () {
      // 从当前文章列表中移除一个文章
      // 怎么从数组中删除一项数据  Array.splice(index,1)
      // 根据当前点击文章的ID 获取其对应的索引
      // find 找到符合条件的  选项   findIndex  找到符合条件的选项的对应  索引
      const articles = this.activeChannel.articles
      const index = articles.findIndex(item => item.art_id === this.articleId)
      articles.splice(index, 1)
    },
    // 打开更多操作
    openMoreAction (artId) {
      // 打开 more-action 中的 van-popup 组件
      this.showMoreAction = true
      // 记录当前点击的文章ID
      this.articleId = artId
    },
    // 滚动事件
    remember (e) {
      // 在当前频道下记录  目前滚动的位置
      this.activeChannel.scrollTop = e.target.scrollTop
    },
    // 切换频道
    changeChannel () {
      // 没有数据
      if (!this.activeChannel.articles.length) {
        // 开启当前频道的上拉加载效果
        this.activeChannel.upLoading = true
        // 主动加载当前频道的数据
        this.onLoad()
      } else {
        // 有数据时
        // 获取当前激活的滚动容器设置记忆的位置即可。
        // 执行顺序  我们修改滚动的位置  tab组件滚动到顶部  效果是后面这句代码。
        // 打个比方： setTimeout(()=>{console.log(1)},0)  console.log(2)  怎么让1打印在2打印后打印
        // window.setTimeout(() => {
        //   const domArr = this.$refs['scroll-wrapper'][this.activeIndex]
        //   domArr.scrollTop = this.activeChannel.scrollTop
        // }, 0)
        // vue 提供了上述类似的功能  $nextTick()   下一帧后执行（延时一些时间）
        // $nextTick   使用场景：改变数据，驱动视图更新，马上去操作dom（获取不到dom）,在$nextTick中操作dom
        this.$nextTick(() => {
          const domArr = this.$refs['scroll-wrapper'][this.activeIndex]
          domArr.scrollTop = this.activeChannel.scrollTop
        })
      }
    },
    // 获取频道列表
    async getMyChannels () {
      const data = await getMyChannels()
      // data.chennels 数据结构 [{id,name},...]
      // 不满足页面的数据要求，转化成另外一种格式。
      // map() 数组提供的函数，遍历当前数组，生成一个新的数组，
      // 在遍历的时候回调函数的返回值，就是新数组中的每一项。
      // 注意：在箭头函数 => {}  解析的时候不是对象 而是代码块
      // 写法：如果一定要直接返回对象  包裹小括号
      // 清空当前的频道数据  (tabs组件会对数据有缓存，严谨操作)
      this.channels = []
      this.channels = data.channels.map(item => ({
        id: item.id,
        name: item.name,
        // 是否正在上拉加载中
        upLoading: false,
        // 是否正在下拉刷新中
        downLoading: false,
        // 是否加载了所有的数据
        finished: false,
        // 文章列表
        articles: [],
        // 获取数据的时间戳
        timestamp: Date.now(),
        // 阅读位置
        scrollTop: 0
      }))
    },
    async onRefresh () {
      // onRefresh 在下拉后 松手后 触发的函数 （获取数据，替换，进行列表渲染）
      // 获取数据 (获取到了数据，获取不到数据--->提示“暂无更新”,不需要替换列表)
      // window.setTimeout(() => {
      //   // 获取数据成功
      //   // const data = [1, 2, 3, 4, 5, 6]
      //   const data = []
      //   // 结束下拉刷新效果
      //   this.downLoading = false
      //   if (data.length) {
      //     this.articles = data
      //     // 加载有数据的文案
      //     this.refreshSuccessText = '更新成功'
      //     // 防止看到 没有更多了 信息 （重新刷新列表，下一页应该是有数据的）
      //     this.finished = false
      //     // 防止数据不够一屏 再来一次上拉加载数据 onLoad
      //     this.onLoad()
      //   } else {
      //     // 加载没有数据的文案
      //     this.refreshSuccessText = '暂无更新'
      //   }
      // }, 1000)

      await this.$sleep()
      this.activeChannel.timestamp = Date.now()
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      // 结束下拉刷新效果
      this.activeChannel.downLoading = false
      // 判断是否有数据
      if (data.results.length) {
        this.activeChannel.articles = data.results
        // 加载有数据的文案
        this.refreshSuccessText = '更新成功'
        // 防止看到 没有更多了 信息 （重新刷新列表，下一页应该是有数据的）
        this.activeChannel.finished = false
        // 加上时间戳 加载下一页数据
        this.activeChannel.timestamp = data.pre_timestamp
        // 防止数据不够一屏 再来一次上拉加载数据 onLoad
        this.onLoad()
      } else {
        // 加载没有数据的文案
        this.refreshSuccessText = '暂无更新'
      }
    },
    async onLoad () {
      // // onLoad 组件初始化默认执行一次，如果数据对应的页面不够一屏，自动再加载一次。
      // // 触发上拉加载触发当前函数 (获取数据，累加，进行列表渲染)
      // // 模拟获取数据，模拟网络延时
      // window.setTimeout(() => {
      //   // 获取数据成功，模拟一下数据
      //   const data = []
      //   // 1-10  11-20  21-30 ...
      //   for (
      //     let i = this.articles.length + 1;
      //     i <= this.articles.length + 10;
      //     i++
      //   ) {
      //     data.push(i)
      //   }
      //   // 获取文章列表ok
      //   this.articles.push(...data)
      //   // 结束上拉加载效果
      //   this.upLoading = false
      //   // 是否所有数据已经加载完毕 （模拟一下，数据超过50就加载完毕）
      //   if (this.articles.length >= 50) {
      //     this.finished = true
      //   }
      // }, 1000)

      // 模拟网络延时 （请勿模仿）
      await this.$sleep()
      // 调用函数需要（当前频道的ID，当前频道的时间戳）
      // 获取当前频道 根据tab激活的选项卡获取
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      // 把获取的数据累加到当前频道下的文章列表中
      this.activeChannel.articles.push(...data.results)
      // 结束上拉加载效果
      this.activeChannel.upLoading = false
      // 是否所有数据已经加载完毕
      if (!data.pre_timestamp) {
        // 已经没有更多数据了
        this.activeChannel.finished = true
      } else {
        // 把后端返回的时间戳 记录下来  下次请求需要使用
        this.activeChannel.timestamp = data.pre_timestamp
      }
    }
  }
}
</script>

<style scoped lang='less'>
// /deep/  深度
// style标签上scoped属性：让样式在当前组件下生效，子级组件内不能失效。
// .vue 中的style标签是 vue-loader 解析 /deep/ 覆盖子组件的样式
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
// 文章列表样式
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
