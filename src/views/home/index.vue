<template>
  <div class="container">
    <van-tabs swipeable>
      <van-tab :key="index" v-for="index in 8" :title="'标签 ' + index">
        <!-- 需要滚动条  将来实现阅读记忆功能 -->
        <div class="scroll-wrapper">
          <van-cell-group>
            <van-cell v-for="item in 20" :key="item">{{index}}</van-cell>
          </van-cell-group>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" slot="nav-right">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
export default {}
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
</style>
