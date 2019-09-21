<template>
  <div class="container">
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <van-list v-model="upLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell-group>
        <van-cell @click="$router.push('/article/'+article.art_id)" v-for="article in articles" :key="article.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{article.title}}</h3>
            <div class="img_box" v-if="article.cover.type===3">
              <van-image class="w33" fit="cover" :src="article.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="article.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="article.cover.images[2]" />
            </div>
            <div class="img_box" v-if="article.cover.type===1">
              <van-image class="w100" fit="cover" :src="article.cover.images[0]"/>
            </div>
            <div class="info_box">
              <span>{{article.aut_name}}</span>
              <span>{{article.comm_count}}评论</span>
              <span>{{article.pubdate|relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { searchArticles } from '@/api/article'
export default {
  name: 'search-result',
  data () {
    return {
      upLoading: false,
      finished: false,
      articles: [],
      reqParams: {
        page: 1,
        q: this.$route.query.q
      }
    }
  },
  methods: {
    async onLoad () {
      await this.$sleep()
      // 获取数据 进行渲染 主动触发一次
      const data = await searchArticles(this.reqParams)
      this.articles.push(...data.results)
      // 去掉加载效果
      this.upLoading = false
      // 是否加载了所有的数据
      if (data.results.length) {
        // 下一次请求的页码
        this.reqParams.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
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
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
