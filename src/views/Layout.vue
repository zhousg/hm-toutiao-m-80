<template>
  <div class="container">
    <!-- 当路由地址（path === $route.path）不是`我的`才显示 -->
    <van-nav-bar
      v-if="path!=='/user'"
      fixed
      title="黑马头条"
      right-text="搜索"
      @click-right="$router.push('/search')"
    />
    <div class="my-wrapper" :class="{noTop:path==='/user'}">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <van-tabbar route>
      <van-tabbar-item name="/" to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item name="/question" to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item name="/video" to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item name="/user" to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  computed: {
    path () {
      return this.$route.path
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
